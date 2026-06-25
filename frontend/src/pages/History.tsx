import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, Clock, Filter, ChevronDown } from 'lucide-react';
import { contentService } from '../services/contentService';
import type { HistoryItem } from '../types';
import '../styles/History.css';

const FEATURE_ICONS: Record<string, string> = {
  story: '📖', campaign: '📣', brand_kit: '🎨',
  caption: '💬', script: '🎬', brainstorm: '💡',
};

const FILTERS = ['All', 'story', 'campaign', 'brand_kit', 'caption', 'script', 'brainstorm'];

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 12;

  const fetchHistory = async (f: string, p: number) => {
    setLoading(true);
    try {
      const res = await contentService.getHistory({
        feature_type: f === 'All' ? undefined : f,
        skip: p * limit,
        limit,
      });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(filter, page);
  }, [filter, page]);

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setPage(0);
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Generation History</h1>
        <p>Review and manage all your AI-generated content</p>
      </div>

      <div className="history-toolbar">
        <div className="history-filters">
          <Filter size={14} />
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => handleFilterChange(f)}
            >
              {f === 'All' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="history-count">{total} items</span>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Clock size={24} /></div>
          <h3>No history found</h3>
          <p>Your generated content will appear here after you start creating.</p>
        </div>
      ) : (
        <div className="history-grid">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className={`history-card${expanded === item.id ? ' expanded' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="history-card__header">
                <div className="history-card__left">
                  <span className="history-card__icon">{FEATURE_ICONS[item.feature_type] || '✨'}</span>
                  <div>
                    <span className="history-card__type">{item.feature_type.replace('_', ' ')}</span>
                    <p className="history-card__prompt">{item.prompt.substring(0, 100)}...</p>
                  </div>
                </div>
                <div className="history-card__actions">
                  <span className="history-card__date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <button
                    className="history-expand"
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    aria-label="Toggle preview"
                  >
                    <ChevronDown size={16} className={expanded === item.id ? 'rotated' : ''} />
                  </button>
                  <button className="history-delete" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {expanded === item.id && (
                <motion.div
                  className="history-card__body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <pre className="history-result">{item.result?.substring(0, 500)}...</pre>
                  {item.tokens_used > 0 && (
                    <span className="history-meta">{item.tokens_used} tokens · {item.model_used}</span>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="history-pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="page-info">{page + 1} / {Math.ceil(total / limit)}</span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={(page + 1) * limit >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
