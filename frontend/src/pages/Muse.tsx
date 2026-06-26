import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Lightbulb } from 'lucide-react';
import { contentService } from '../services/contentService';
import type { ChatMessage } from '../types';
import '../styles/Muse.css';

const STARTERS = [
  "Help me develop a unique concept for a short film about loneliness in a digital age.",
  "I want to write a brand story for an eco-fashion startup. Where do I begin?",
  "Give me 5 unexpected angles for a campaign targeting Gen Z around mental wellness.",
  "I'm stuck on my novel's second act. The hero just discovered a betrayal — what are my options?",
  "How do I make my social media content feel more authentic and less 'branded'?",
];

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    "Hello! I'm your Creative Muse — an AI built to think *with* you, not just *for* you.\n\nTell me about what you're working on, share an idea you're wrestling with, or just say \"I have no idea what to create\" — we'll figure it out together. What's on your creative mind today?",
};

export default function Muse() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = { role: 'user', content };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Send all messages except the initial welcome (it's local only)
      const payload = newHistory.filter((m) => !(m === WELCOME));
      const res = await contentService.chat(payload);
      setMessages([...newHistory, { role: 'assistant', content: res.reply }]);
    } catch {
      setMessages([
        ...newHistory,
        { role: 'assistant', content: "I lost my train of thought for a moment — could you try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setInput('');
  };

  const formatContent = (text: string) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));

  return (
    <div className="muse-page">
      <div className="muse-header">
        <div className="muse-header__left">
          <div className="muse-avatar">
            <Sparkles size={20} />
          </div>
          <div>
            <h1>Creative Muse</h1>
            <p>Your AI creative partner — brainstorm, refine, and explore ideas together</p>
          </div>
        </div>
        <button className="muse-reset" onClick={reset} title="Start new conversation">
          <RotateCcw size={15} /> New chat
        </button>
      </div>

      {messages.length === 1 && (
        <motion.div
          className="muse-starters"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="muse-starters__label">
            <Lightbulb size={14} /> Try a conversation starter
          </p>
          <div className="muse-starters__grid">
            {STARTERS.map((s, i) => (
              <button key={i} className="muse-starter-card" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="muse-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`muse-bubble muse-bubble--${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.role === 'assistant' && (
                <div className="muse-bubble__avatar">
                  <Sparkles size={14} />
                </div>
              )}
              <div className="muse-bubble__content">
                {formatContent(msg.content)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            className="muse-bubble muse-bubble--assistant"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="muse-bubble__avatar">
              <Sparkles size={14} />
            </div>
            <div className="muse-bubble__content muse-typing">
              <span /><span /><span />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="muse-input-area">
        <textarea
          ref={textareaRef}
          className="muse-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Share an idea, ask for feedback, or just start talking…"
          rows={2}
          disabled={loading}
        />
        <button
          className="muse-send"
          onClick={() => send()}
          disabled={!input.trim() || loading}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="muse-hint">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
