import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Megaphone, Palette, Sparkles,
  TrendingUp, Clock, Archive, ArrowRight, Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contentService } from '../services/contentService';
import type { HistoryItem } from '../types';
import '../styles/Dashboard.css';

const TOOLS = [
  { to: '/studio', icon: Sparkles, label: 'Creative Studio', desc: 'Brainstorm & generate any content', color: '#f59e0b' },
  { to: '/story', icon: BookOpen, label: 'Story Generator', desc: 'Fiction, scripts & narratives', color: '#5b6af0' },
  { to: '/campaign', icon: Megaphone, label: 'Campaign Planner', desc: 'Full marketing campaigns', color: '#7c5cd8' },
  { to: '/brand-kit', icon: Palette, label: 'Brand Kit', desc: 'Identity, voice & brand system', color: '#0ea5e9' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    contentService.getHistory({ limit: 5 })
      .then((r) => setHistory(r.items))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  const FEATURE_ICONS: Record<string, string> = {
    story: '📖', campaign: '📣', brand_kit: '🎨', caption: '💬',
    script: '🎬', brainstorm: '💡',
  };

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Good {getHour()}, {user?.full_name?.split(' ')[0]} ✦</h1>
          <p>What would you like to create today?</p>
        </div>
        <Link to="/studio" className="btn btn-primary">
          <Plus size={16} /> New Creation
        </Link>
      </motion.div>

      <section className="dashboard-tools">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={tool.to} className="tool-card">
              <div
                className="tool-card__icon"
                style={{ background: `${tool.color}18`, color: tool.color }}
              >
                <tool.icon size={22} />
              </div>
              <div className="tool-card__info">
                <h3>{tool.label}</h3>
                <p>{tool.desc}</p>
              </div>
              <ArrowRight size={16} className="tool-card__arrow" />
            </Link>
          </motion.div>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-recent">
          <div className="dashboard-section-header">
            <h2><Clock size={18} /> Recent Generations</h2>
            <Link to="/history" className="view-all">View All</Link>
          </div>

          {historyLoading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Sparkles size={24} /></div>
              <h3>No generations yet</h3>
              <p>Start creating content to see your history here.</p>
              <Link to="/studio" className="btn btn-primary">Start Creating</Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <span className="history-item__icon">
                    {FEATURE_ICONS[item.feature_type] || '✨'}
                  </span>
                  <div className="history-item__content">
                    <p className="history-item__type">{item.feature_type.replace('_', ' ')}</p>
                    <p className="history-item__prompt">{item.prompt.substring(0, 80)}...</p>
                  </div>
                  <span className="history-item__date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-section-header">
            <h2><TrendingUp size={18} /> Your Activity</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card__num">{history.length}</span>
              <span className="stat-card__label">Generations</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__num">
                {history.reduce((a, i) => a + (i.tokens_used || 0), 0).toLocaleString()}
              </span>
              <span className="stat-card__label">Tokens Used</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__num">{user?.plan}</span>
              <span className="stat-card__label">Current Plan</span>
            </div>
          </div>

          <div className="dashboard-ai-info">
            <p className="ai-info-label">Powered by</p>
            <div className="ai-badges">
              <span className="ai-badge groq">Groq LLaMA 3</span>
              <span className="ai-badge watson">IBM Watson NLU</span>
            </div>
          </div>

          <Link to="/assets" className="dashboard-quick-link">
            <Archive size={16} /> View Asset Library <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
