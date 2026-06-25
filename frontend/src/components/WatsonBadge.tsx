import type { WatsonAnalysis } from '../types';
import '../styles/WatsonBadge.css';

interface Props {
  analysis: WatsonAnalysis;
  compact?: boolean;
}

const EMOTION_COLORS: Record<string, string> = {
  joy: '#f59e0b',
  sadness: '#6366f1',
  anger: '#ef4444',
  fear: '#8b5cf6',
  disgust: '#6b7280',
};

export function WatsonBadge({ analysis, compact }: Props) {
  const sentiment = analysis.sentiment?.document;
  const emotionEntries = Object.entries(analysis.emotions || {});
  const topEmotion = emotionEntries.sort((a, b) => b[1] - a[1])[0];

  return (
    <div className={`watson-badge${compact ? ' compact' : ''}`}>
      <div className="watson-badge__header">
        <span className="watson-badge__title">✦ IBM Watson Analysis</span>
      </div>

      <div className="watson-badge__metrics">
        {analysis.quality_score !== undefined && (
          <div className="watson-metric">
            <span className="metric-label">Quality Score</span>
            <div className="metric-bar">
              <div
                className="metric-bar__fill"
                style={{ width: `${analysis.quality_score}%`, background: 'var(--color-accent)' }}
              />
            </div>
            <span className="metric-val">{analysis.quality_score}/100</span>
          </div>
        )}

        {sentiment && (
          <div className="watson-chips">
            <span
              className={`watson-chip ${sentiment.label}`}
            >
              {sentiment.label} ({Math.round(Math.abs(sentiment.score) * 100)}%)
            </span>

            {topEmotion && (
              <span
                className="watson-chip emotion"
                style={{ background: `${EMOTION_COLORS[topEmotion[0]] || '#6366f1'}20`, color: EMOTION_COLORS[topEmotion[0]] || '#6366f1' }}
              >
                {topEmotion[0]} {Math.round(topEmotion[1] * 100)}%
              </span>
            )}

            {analysis.readability && (
              <span className="watson-chip readability">{analysis.readability} readability</span>
            )}
          </div>
        )}

        {analysis.top_keywords && analysis.top_keywords.length > 0 && !compact && (
          <div className="watson-keywords">
            <span className="metric-label">Key Topics</span>
            <div className="keyword-pills">
              {analysis.top_keywords.slice(0, 6).map((kw) => (
                <span key={kw} className="keyword-pill">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
