import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Megaphone, Sparkles, RotateCcw, Play, Copy, ArrowRight,
  Lightbulb, Smile, HelpCircle, BarChart3
} from 'lucide-react';
import { contentService } from '../services/contentService';
import '../styles/CampaignABTester.css';

const PERSONAS = [
  'Gen-Z Tech Enthusiasts (18-24)',
  'Mid-Career Corporate Managers (30-45)',
  'Busy Working Parents (25-40)',
  'Budget-Conscious Students (18-22)',
  'Retired Active Seniors (60+)',
  'Eco-Conscious Lifestyle Consumers'
];

const STYLES = [
  { value: 'punchy', label: 'Short & Punchy' },
  { value: 'emotional', label: 'More Emotional' },
  { value: 'professional', label: 'More Professional' },
  { value: 'curiosity', label: 'Curiosity-Inducing' },
  { value: 'direct', label: 'Direct Benefit-Driven' }
];

export default function CampaignABTester() {
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [styleOpt, setStyleOpt] = useState('punchy');
  
  const [loading, setLoading] = useState(false);
  const [generatingB, setGeneratingB] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerateVariantB = async () => {
    if (!variantA) {
      toast.error('Please enter Variant A first to generate an alternative.');
      return;
    }
    setGeneratingB(true);
    try {
      const res = await contentService.generateCampaignVariant({
        variant_a: variantA,
        tone_or_style: styleOpt
      });
      setVariantB(res.content);
      toast.success('Variant B generated with AI!');
    } catch (err: any) {
      toast.error('Failed to generate variant. Make sure backend is running.');
    } finally {
      setGeneratingB(false);
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !variantA || !variantB) {
      toast.error('Please fill in Topic, Variant A, and Variant B.');
      return;
    }
    setLoading(true);
    try {
      const res = await contentService.runCampaignTest({
        campaign_topic: topic,
        variant_a: variantA,
        variant_b: variantB,
        target_persona: persona
      });
      setResult(res);
      toast.success('Simulation complete!');
    } catch (err: any) {
      toast.error('Simulation failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTopic('');
    setPersona(PERSONAS[0]);
    setVariantA('');
    setVariantB('');
    setResult(null);
  };

  return (
    <div className="ab-tester-page">
      <div className="ab-tester-layout">
        <div className="ab-form-panel">
          <div className="ab-panel-header">
            <div className="ab-panel-icon" style={{ background: '#f0ebfc', color: '#7c5cd8' }}>
              <Megaphone size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Campaign A/B Tester</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Simulate customer response before launching
              </p>
            </div>
          </div>

          <form onSubmit={handleRunSimulation} className="ab-form">
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Campaign Topic / Product *</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. UltraFit Smartwatch launch"
                className="form-input"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Target Persona Focus Group *</label>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              >
                {PERSONAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Copy Variant A *</label>
              <textarea
                value={variantA}
                onChange={(e) => setVariantA(e.target.value)}
                placeholder="Enter your first version of the campaign copy or headline..."
                rows={3}
                className="form-input"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group" style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div className="variant-generator-header">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Copy Variant B (AI Assisted)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={styleOpt}
                    onChange={(e) => setStyleOpt(e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  >
                    {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={handleGenerateVariantB}
                    disabled={generatingB}
                    className="btn-ai-gen"
                  >
                    {generatingB ? 'Generating...' : <><Sparkles size={12} /> Auto-Gen B</>}
                  </button>
                </div>
              </div>
              <textarea
                value={variantB}
                onChange={(e) => setVariantB(e.target.value)}
                placeholder="Enter version B, or click Auto-Gen B to generate it based on Variant A..."
                rows={3}
                className="form-input"
                required
                style={{ width: '100%', marginTop: '8px', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', background: '#fff' }}
              />
            </div>

            <div className="ab-form-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                style={{ flex: 1 }}
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || generatingB}
                style={{ flex: 1.5, background: 'var(--color-secondary)', border: 'none', color: '#fff' }}
              >
                {loading ? <><span className="spinner" /> Testing...</> : <><Play size={14} /> Simulate Test</>}
              </button>
            </div>
          </form>
        </div>

        <div className="ab-output-panel">
          {loading && (
            <div className="output-loading">
              <div className="spinner spinner-lg" />
              <p>Orchestrating simulated persona focus group...</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Groq LLaMA 3 computing customer reaction models</span>
            </div>
          )}

          {!loading && !result && (
            <div className="output-empty" style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BarChart3 size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Simulation Sandbox Ready</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Define copy variants, pick a focus group, and run the simulator to view analytics.
              </span>
            </div>
          )}

          {!loading && result && (
            <motion.div
              className="ab-output-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Winner Announcement Banner */}
              <div className="winner-banner">
                <Smile className="winner-icon" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Winner: {result.winner}</h3>
                  <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9 }}>
                    Based on predicted emotional resonance and response vectors for {persona}.
                  </p>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="comparison-grid">
                {/* Variant A */}
                <div className={`variant-card ${result.winner === 'Variant A' ? 'winner' : ''}`}>
                  <span className="variant-tag a">Variant A</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Content</h4>
                  <div className="variant-text-preview">{variantA}</div>
                  
                  <div className="metrics-list">
                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Predicted CTR</span>
                        <span className="metric-value">{result.variant_a_metrics.ctr}%</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_a_metrics.ctr}%`, background: 'var(--color-accent)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Conversion Rate</span>
                        <span className="metric-value">{result.variant_a_metrics.conversion}%</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_a_metrics.conversion * 10}%`, background: 'var(--color-accent)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Readability Score</span>
                        <span className="metric-value">{result.variant_a_metrics.readability}/100</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_a_metrics.readability}%`, background: 'var(--color-accent)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Dominant Tone</span>
                        <span className="metric-value" style={{ color: 'var(--color-accent)', textTransform: 'capitalize' }}>
                          {result.variant_a_metrics.emotional_resonance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className={`variant-card ${result.winner === 'Variant B' ? 'winner' : ''}`}>
                  <span className="variant-tag b">Variant B</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Content</h4>
                  <div className="variant-text-preview">{variantB}</div>

                  <div className="metrics-list">
                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Predicted CTR</span>
                        <span className="metric-value">{result.variant_b_metrics.ctr}%</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_b_metrics.ctr}%`, background: 'var(--color-secondary)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Conversion Rate</span>
                        <span className="metric-value">{result.variant_b_metrics.conversion}%</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_b_metrics.conversion * 10}%`, background: 'var(--color-secondary)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Readability Score</span>
                        <span className="metric-value">{result.variant_b_metrics.readability}/100</span>
                      </div>
                      <div className="metric-bar-bg">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${result.variant_b_metrics.readability}%`, background: 'var(--color-secondary)' }}
                        />
                      </div>
                    </div>

                    <div className="metric-row">
                      <div className="metric-info">
                        <span className="metric-label">Dominant Tone</span>
                        <span className="metric-value" style={{ color: 'var(--color-secondary)', textTransform: 'capitalize' }}>
                          {result.variant_b_metrics.emotional_resonance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cognitive Analysis */}
              <div className="analysis-section">
                <h3><Lightbulb size={18} /> Psychographic Campaign Analysis</h3>
                <p className="analysis-text">{result.comparative_analysis}</p>
              </div>

              {/* Persona Feedback */}
              {result.persona_feedback && result.persona_feedback.length > 0 && (
                <div className="feedback-section">
                  <h3>Focus Group Feedback ({persona})</h3>
                  <div className="feedback-list">
                    {result.persona_feedback.map((f: any, idx: number) => (
                      <div key={idx} className="feedback-bubble">
                        <div className="feedback-avatar">{f.name.charAt(0)}</div>
                        <div className="feedback-content">
                          <div className="feedback-meta">
                            <div>
                              <span className="feedback-name">{f.name}</span>
                              <span className="feedback-job"> • {f.age} y/o {f.occupation}</span>
                            </div>
                            <span className={`feedback-sentiment-badge ${f.sentiment}`}>
                              {f.sentiment}
                            </span>
                          </div>
                          <p className="feedback-text">"{f.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements Suggestions */}
              <div className="improvements-section">
                <div className="improvement-card">
                  <h4><ArrowRight size={14} style={{ color: 'var(--color-accent)' }} /> Improve Variant A</h4>
                  <div className="improvement-list">
                    {result.variant_a_improvements?.map((imp: string, idx: number) => (
                      <div key={idx} className="improvement-item">
                        <span className="improvement-bullet">✓</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="improvement-card">
                  <h4><ArrowRight size={14} style={{ color: 'var(--color-secondary)' }} /> Improve Variant B</h4>
                  <div className="improvement-list">
                    {result.variant_b_improvements?.map((imp: string, idx: number) => (
                      <div key={idx} className="improvement-item">
                        <span className="improvement-bullet">✓</span>
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
