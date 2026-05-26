import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Loader2, RotateCcw, Sparkles, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  error?: boolean;
}

const SUGGESTED = [
  'What products do you sell?',
  'Return policy?',
  'Track my order',
  'Headphones price?',
];

export function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState('');
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "👋 Hi! I'm DM Bot, your DM Tech assistant. Ask me anything about our products, orders, shipping, or returns!",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    const history = [...messages.filter(m => !m.error), userMsg];

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString() + '-err', role: 'bot', text: data.error ?? 'Something went wrong. Please try again.', error: true },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString() + '-bot', role: 'bot', text: data.text },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString() + '-err', role: 'bot', text: "Can't reach the assistant right now. Please check your connection.", error: true },
      ]);
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([{
      id: 'welcome',
      role: 'bot',
      text: "👋 Hi! I'm DM Bot, your DM Tech assistant. Ask me anything about our products, orders, shipping, or returns!",
    }]);
    setInput('');
  };

  return (
    <>
      {/* ── Floating chat button ─────────────────────────────────────────── */}
      <motion.button
        id="chatbot-toggle"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-primary shadow-lg shadow-brand-primary/40 flex items-center justify-center text-bg-dark hover:scale-110 active:scale-95 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI chat assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="chatbot-panel"
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col"
            style={{ height: '520px' }}
          >
            <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-[#111112] shadow-2xl shadow-black/60 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/15 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">DM Bot</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-[10px] text-gray-500">AI Assistant · Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    title="Clear chat"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold
                      ${msg.role === 'bot'
                        ? 'bg-brand-primary/20 text-brand-primary'
                        : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {msg.role === 'bot' ? <Bot className="w-3.5 h-3.5" /> : 'You'}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'user'
                        ? 'bg-brand-primary text-bg-dark font-medium rounded-tr-sm'
                        : msg.error
                          ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm'
                          : 'bg-white/[0.07] text-gray-200 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 flex-row"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-3.5 h-3.5 text-brand-primary animate-spin" />
                    </div>
                    <div className="bg-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Suggested prompts — show only at start */}
              {messages.length <= 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0">
                  {SUGGESTED.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:border-brand-primary/50 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t border-white/10 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  id="chatbot-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 disabled:opacity-50 transition-colors"
                />
                <button
                  id="chatbot-send"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-bg-dark hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                >
                  {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </form>

              {/* Footer */}
              <div className="px-4 pb-3 flex items-center justify-center gap-1 flex-shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-gray-600" />
                <p className="text-[9px] text-gray-600 uppercase tracking-widest">Powered by Gemini AI</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
