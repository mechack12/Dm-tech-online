/**
 * DM Tech AI Proxy Server
 * Keeps the Gemini API key ONLY on the server — never in the browser.
 */
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const XAI_API_KEY = process.env.XAI_API_KEY ?? '';

if (!GEMINI_API_KEY && !XAI_API_KEY) {
  console.error('\n❌  Neither GEMINI_API_KEY nor XAI_API_KEY is set in .env\n');
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
const XAI_MODELS = ['grok-2-1212', 'grok-2', 'grok-2-latest', 'grok-beta'];

// ── Rich store-aware system prompt ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DM Bot, a friendly and knowledgeable AI assistant for DM Tech Online — a premium e-commerce store based in Kigali, Rwanda.

STORE INFORMATION:
- Store Name: DM Tech Online / DM Tech LTD
- Location: Kigali, Rwanda
- Email: dushimemechack1@gmil.com
- Phone: +250784510083
- Website: dmtechltd.com
- Hours: Monday–Friday, business hours (human team)
- AI Assistant: Available 24/7 (that's you!)

PRODUCT CATALOG:
1. Quantum Wireless Over-Ear Headphones — $299.00
   - SKU: ELC-4029-BK | Category: Electronics / Audio
   - Features: Active Noise Cancellation, Wireless, Premium build
   - Colors: Midnight Slate, Sandstone, Forest Green
   - Rating: 4/5 (128 reviews) | Stock: Available

2. AeroGrip Performance Runners — $145.00
   - SKU: FTW-1049-RED | Category: Fashion / Men
   - Features: Lightweight, Breathable mesh, Advanced cushioning
   - Rating: 4.5/5 (84 reviews) | Stock: Low (18 units)

3. Nexus Smartwatch Pro — $199.99 (was $250.00)
   - SKU: ELC-8821-WHT | Category: Electronics / Wearables
   - Features: Health tracking, Minimalist design, Connected
   - Rating: 3.8/5 (42 reviews) | Stock: Available (45 units)

4. Artisan Ceramic Mug Set — $45.00
   - SKU: HOM-3301-NAT | Category: Home / Kitchen
   - Features: Hand-crafted, Matte finish, Coffee ritual perfect
   - Rating: 4.8/5 (210 reviews) | Stock: OUT OF STOCK

CATEGORIES AVAILABLE: Electronics, Fashion, Home & Kitchen
DEALS: Nexus Smartwatch Pro is currently on sale (20% off)

POLICIES:
- Returns: Items can be returned within 30 days of delivery in original condition
- Warranty: Electronics come with a 1-year manufacturer warranty
- Shipping: Standard 3-5 business days; express options available
- Payment: We accept major credit cards and mobile money

HOW TO USE THE STORE:
- Browse products on the Shop page
- Add items to cart and proceed to checkout
- Track orders in the Order History section
- Contact support via this chat or email/phone above
- Register/Login to track your orders and get personalized service

YOUR BEHAVIOR:
- Be warm, helpful, concise, and professional
- Always answer questions about products, orders, shipping, returns, and store policies
- If asked about a specific product, provide price, availability, and key features
- If asked about stock, use the catalog data above
- If a question is completely unrelated to the store or shopping, politely redirect
- Use emojis occasionally to keep the tone friendly 😊
- Keep responses concise — 2-4 sentences for simple questions, longer only when needed
- If you don't know something specific (like a customer's personal order), ask them to contact the team directly`;

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
});
app.options('/api/chat', (_req, res) => res.sendStatus(200));

// ── Chat endpoint ──────────────────────────────────────────────────────────────
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  let messages = req.body.messages as { role: string; text: string }[] | undefined;
  const { prompt } = req.body as { prompt?: string };

  // Normalize prompt payload from SupportScreen to messages structure
  if (prompt && (!messages || messages.length === 0)) {
    messages = [{ role: 'user', text: prompt }];
  }

  if (!messages || messages.length === 0) {
    res.status(400).json({ error: 'messages or prompt is required' });
    return;
  }

  // 1. Attempt xAI Grok first if XAI_API_KEY is configured
  if (XAI_API_KEY) {
    const xaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    for (const model of XAI_MODELS) {
      try {
        console.log(`[xAI] Trying model: ${model}`);
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${XAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: xaiMessages,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json() as any;
        const text = data?.choices?.[0]?.message?.content ?? '';
        if (text) {
          console.log(`[xAI] ✅ Success with: ${model}`);
          res.json({ text, provider: 'Grok' });
          return;
        }
      } catch (err: unknown) {
        console.warn(`[xAI] ⚠️  ${model} failed:`, (err as any)?.message ?? err);
      }
    }
    console.warn('[xAI] All models failed or xAI API key is invalid. Falling back to Gemini...');
  }

  // 2. Fallback or primary run with Gemini
  if (!ai) {
    res.status(503).json({
      error: 'AI assistant is not configured. Please contact support.',
    });
    return;
  }

  // Build full prompt with conversation history for Gemini
  const history = messages
    .map(m => `${m.role === 'user' ? 'Customer' : 'DM Bot'}: ${m.text}`)
    .join('\n');
  const fullPrompt = history;

  let lastErr: unknown = null;

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Trying model: ${model}`);
      const result = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: { systemInstruction: SYSTEM_PROMPT },
      });

      const text = result.text ?? '';
      console.log(`[Gemini] ✅ Success with: ${model}`);
      res.json({ text, provider: 'Gemini' });
      return;
    } catch (err: unknown) {
      lastErr = err;
      const raw = (err as any)?.message ?? JSON.stringify(err);
      console.warn(`[Gemini] ⚠️  ${model} failed:`, raw);

      const isQuota    = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');
      const isNotFound = raw.includes('NOT_FOUND') || raw.includes('not found');
      if (isQuota || isNotFound) {
        await new Promise(r => setTimeout(r, 800));
        continue;
      }
      break;
    }
  }

  const raw = (lastErr as any)?.message ?? JSON.stringify(lastErr);
  const isAuth     = raw.includes('API key') || raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID');
  const isQuotaErr = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');

  const friendly = isAuth
    ? 'Authentication error. Please contact the store administrator.'
    : isQuotaErr
    ? 'I am temporarily unavailable due to high demand. Please try again in a few minutes or contact us at +250784510083.'
    : 'Something went wrong. Please try again or contact support.';

  res.status(502).json({ error: friendly });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiKeyConfigured: !!GEMINI_API_KEY,
    xaiKeyConfigured: !!XAI_API_KEY,
    activeProvider: XAI_API_KEY ? 'Grok' : (GEMINI_API_KEY ? 'Gemini' : 'None'),
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀  DM Tech AI proxy running on http://localhost:${PORT}`);
  console.log(`    xAI Grok API key: ${XAI_API_KEY ? '✅ configured' : '❌ MISSING'}`);
  console.log(`    Gemini API key:   ${GEMINI_API_KEY ? '✅ configured' : '❌ MISSING'}\n`);
});
