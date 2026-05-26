/**
 * DM Tech AI Proxy Server
 * ─────────────────────────────────────────────────────────────
 * Keeps the Gemini API key ONLY on the server — never in the browser.
 * The frontend posts to /api/chat and this server calls Gemini.
 */
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const PORT = 3001;
const API_KEY = process.env.GEMINI_API_KEY ?? '';

// Fail loudly at startup if the key is missing
if (!API_KEY) {
  console.error('\n❌  GEMINI_API_KEY is not set in .env — the AI assistant will not work.\n');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Models tried in order — fallback if one is unavailable
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

const SYSTEM_PROMPT = `You are a helpful AI assistant for DM Tech Online, a premium e-commerce store
based in Kigali, Rwanda. You help customers with product questions, order issues, returns, shipping,
and general tech support. Keep responses clear, friendly, and concise. If a question is completely
unrelated to shopping or tech, gently steer the conversation back.`;

const app = express();
app.use(express.json());

// ── Allow the Vite dev server (port 3000) to call this server ──────────────
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
});
app.options('/api/chat', (_req, res) => res.sendStatus(200));

// ── Main AI endpoint ───────────────────────────────────────────────────────
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt?.trim()) {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  if (!ai) {
    res.status(503).json({
      error: '🔑 Gemini API key is not configured on the server. ' +
             'Add GEMINI_API_KEY to the .env file and restart the server.',
    });
    return;
  }

  let lastErr: unknown = null;

  for (const model of MODELS) {
    try {
      console.log(`[Gemini] Trying model: ${model}`);
      const result = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction: SYSTEM_PROMPT },
      });

      const text = result.text ?? '';
      console.log(`[Gemini] ✅ Success with model: ${model}`);
      res.json({ text });
      return; // done — don't try other models
    } catch (err: unknown) {
      lastErr = err;
      const raw = (err as any)?.message ?? JSON.stringify(err);
      console.warn(`[Gemini] ⚠️  Model ${model} failed:`, raw);

      const isQuota    = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');
      const isNotFound = raw.includes('NOT_FOUND') || raw.includes('not found');

      if (isQuota || isNotFound) {
        // Try the next model
        await new Promise(r => setTimeout(r, 800));
        continue;
      }

      // Auth or unrecoverable error — stop immediately
      break;
    }
  }

  // All models failed — build a friendly message
  const raw = (lastErr as any)?.message ?? JSON.stringify(lastErr);
  console.error('[Gemini] ❌ All models failed. Last error:', raw);

  const isAuth     = raw.includes('API key') || raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID');
  const isQuotaErr = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');

  const friendly = isAuth
    ? '🔑 Authentication failed. Your Gemini API key may have been revoked. ' +
      'Go to aistudio.google.com → "Get API key", create a NEW key, then update GEMINI_API_KEY in your .env file and restart the server.'
    : isQuotaErr
    ? '⚠️ Daily quota exceeded. Free Gemini keys reset every 24 hours. Please try again later.'
    : 'Something went wrong contacting the AI assistant. Please try again.';

  res.status(502).json({ error: friendly });
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', keyConfigured: !!API_KEY });
});

app.listen(PORT, () => {
  console.log(`\n🚀  DM Tech AI proxy server running on http://localhost:${PORT}`);
  console.log(`    Gemini API key: ${API_KEY ? '✅ configured' : '❌ MISSING — add to .env'}\n`);
});
