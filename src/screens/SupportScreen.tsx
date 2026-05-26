import React, { useState, useRef } from 'react';
import { Card, Button } from '../components/UI';
import { Mail, Phone, MapPin, Globe, Send, Bot, Loader2, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

// ── Gemini client ────────────────────────────────────────────────────────────
// Key is loaded from the .env file (GEMINI_API_KEY=...) — never hardcode it here.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Retry helper – waits `ms` milliseconds before resolving
const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

// ── System context so Gemini acts as a DM Tech support agent ─────────────────
const SYSTEM_PROMPT = `You are a helpful AI assistant for DM Tech Online, a premium e-commerce store
based in Kigali, Rwanda. You help customers with product questions, order issues, returns, shipping,
and general tech support. Keep responses clear, friendly, and concise. If a question is completely
unrelated to shopping or tech, gently steer the conversation back.`;

export function SupportScreen() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [subject, setSubject]     = useState('');
  const [message, setMessage]     = useState('');

  // ── AI state ─────────────────────────────────────────────────────────────────
  const [aiResponse, setAiResponse]   = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [error, setError]             = useState('');
  const [userQuery, setUserQuery]     = useState('');

  const responseRef = useRef<HTMLDivElement>(null);

  const contactInfo = [
    { icon: Mail,  label: 'Email Support',  value: 'dushimemechack1@gmil.com', link: 'mailto:dushimemechack1@gmil.com' },
    { icon: Phone, label: 'Phone Support',  value: '+250784510083',            link: 'tel:+250784510083' },
    { icon: Globe, label: 'Website',        value: 'dmtechltd.com',            link: '#' },
    { icon: MapPin,label: 'Headquarters',   value: 'Kigali, Rwanda',           link: '#' },
  ];

  // ── Core AI call — tries multiple models, falls back automatically ───────────
  // Models tried in order — all confirmed available on this API key
  const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

  const sendToGemini = async (fullPrompt: string) => {
    // Guard: no API key configured
    if (!ai) {
      setUserQuery(fullPrompt);
      setError(
        'No Gemini API key found. Please add GEMINI_API_KEY=your_key to the .env file ' +
        'in the project root, then restart the dev server. ' +
        'Get a free key at aistudio.google.com → "Get API key".'
      );
      return;
    }

    setIsLoading(true);
    setError('');
    setAiResponse('');
    setHasResponse(false);
    setUserQuery(fullPrompt);

    let lastErr: any = null;

    for (const model of MODELS) {
      try {
        console.log(`[Gemini] Trying model: ${model}`);
        const response = await ai.models.generateContent({
          model,
          contents: fullPrompt,
          config: { systemInstruction: SYSTEM_PROMPT },
        });

        const text = response.text ?? '';
        setAiResponse(text);
        setHasResponse(true);
        lastErr = null;
        console.log(`[Gemini] Success with model: ${model}`);

        setTimeout(() => {
          responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        break; // success — stop trying more models
      } catch (err: any) {
        lastErr = err;
        const raw: string = err?.message ?? JSON.stringify(err);
        console.warn(`[Gemini] Model ${model} failed:`, raw);

        // If it's quota/overload, wait 1s then try next model
        const isQuota = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');
        const isNotFound = raw.includes('NOT_FOUND') || raw.includes('not found');
        if (isQuota || isNotFound) {
          await delay(1000);
          continue; // try next model
        }
        // For auth or unknown errors, stop immediately
        break;
      }
    }

    if (lastErr) {
      const raw: string = lastErr?.message ?? JSON.stringify(lastErr);
      console.error('[Gemini] All models failed. Last error:', raw);
      const isAuth  = raw.includes('API key') || raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID');
      const isQuotaErr = raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED');
      const isNotFoundErr = raw.includes('NOT_FOUND') || raw.includes('not found');
      const friendly = isAuth
          ? '🔑 Authentication failed. Your Gemini API key may have expired or been revoked. ' +
            'Go to aistudio.google.com → "Get API key", create a NEW key, then update GEMINI_API_KEY in your .env file and restart the server.'
          : isQuotaErr
          ? '⚠️ Daily quota exceeded. Free Gemini keys reset every 24 hours. ' +
            'Wait until tomorrow or generate a fresh key at aistudio.google.com and update your .env file.'
          : isNotFoundErr
          ? '⚠️ No AI models found for this key. Please verify your API key is valid at aistudio.google.com.'
          : 'Something went wrong contacting the AI assistant. Please try again.';
      setError(friendly);
    }

    setIsLoading(false);
  };

  // ── Form submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    const fullPrompt = subject.trim()
      ? `Subject: ${subject.trim()}\n\n${trimmed}`
      : trimmed;
    await sendToGemini(fullPrompt);
  };

  const handleReset = () => {
    setAiResponse('');
    setHasResponse(false);
    setError('');
    setUserQuery('');
    setMessage('');
    setSubject('');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold font-display tracking-tight mb-6"
        >
          Support Center
        </motion.h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto">
          We're here to help. Ask our AI assistant anything, or contact the team directly.
        </p>
      </div>

      {/* ── Contact cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {contactInfo.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 text-center group" hover>
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-bg-dark transition-all">
                <item.icon className="w-8 h-8 text-brand-primary transition-colors group-hover:text-inherit" />
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{item.label}</h3>
              <a href={item.link} className="text-lg font-bold font-display text-white hover:text-brand-primary transition-colors">
                {item.value}
              </a>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Contact / AI form ────────────────────────────────────────────── */}
      <Card className="p-12 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column – info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-primary" />
              </div>
              <h2 className="text-4xl font-bold font-display">AI Smart Assistant</h2>
            </div>
            <p className="text-gray-400 mb-8 max-w-md">
              Describe your issue or question below and our AI assistant will respond instantly. For complex matters, the team is standing by.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                AI Assistant Online — Instant Replies
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                Human Team Available Mon–Fri
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="mt-10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Try asking…</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Where is my order?',
                  'Return policy',
                  'Warranty info',
                  'Track shipment',
                ].map(hint => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => setMessage(hint)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:border-brand-primary/50 hover:text-white transition-all"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column – form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">First Name</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Last Name</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50"
                placeholder="e.g. Order inquiry, Return request…"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Message <span className="text-brand-primary">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your question or describe your issue here…"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-full py-4 text-sm font-bold uppercase tracking-widest"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>

      {/* ── AI Response panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {(isLoading || hasResponse || error) && (
          <motion.div
            ref={responseRef}
            key="ai-response"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Card className="overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-border-dark bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">DM Tech AI Assistant</p>
                    <p className="text-[10px] text-gray-500">Powered by Gemini</p>
                  </div>
                </div>
                {(hasResponse || error) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    New question
                  </button>
                )}
              </div>

              <div className="p-8 space-y-6">
                {/* Echo the user's question */}
                {userQuery && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">
                      You
                    </div>
                    <div className="bg-white/5 rounded-xl rounded-tl-none px-5 py-3 text-sm text-gray-300 leading-relaxed max-w-2xl whitespace-pre-wrap">
                      {userQuery}
                    </div>
                  </div>
                )}

                {/* Loading skeleton */}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                    </div>
                    <div className="space-y-2 pt-1 flex-1 max-w-2xl">
                      <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-white/10 rounded animate-pulse w-5/6" />
                    </div>
                  </div>
                )}

                {/* AI answer */}
                {hasResponse && aiResponse && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl rounded-tl-none px-5 py-4 text-sm text-gray-200 leading-relaxed max-w-2xl whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl rounded-tl-none px-5 py-4 text-sm text-red-300 leading-relaxed max-w-2xl space-y-3">
                      <p>{error}</p>
                      <button
                        onClick={() => sendToGemini(userQuery)}
                        disabled={isLoading || !userQuery}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-300 border border-red-400/30 rounded-lg px-3 py-1.5 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
