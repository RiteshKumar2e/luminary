import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen, Play, Send, Copy, Download, RotateCcw,
  Sparkles, CheckCircle2, Award, Activity
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { WatsonBadge } from '../components/WatsonBadge';
import type { WatsonAnalysis } from '../types';
import '../styles/PlotArchitect.css';

interface Chapter {
  segment: string;
  choices: string[];
  analysis: WatsonAnalysis;
  choiceMade?: string;
}

const GENRES = ['Fantasy', 'Sci-Fi', 'Romance', 'Thriller', 'Horror', 'Adventure', 'Mystery', 'Sports (Soccer)', 'General'];
const TONES = ['Hopeful', 'Dark', 'Humorous', 'Suspenseful', 'Inspiring', 'Neutral'];

export default function PlotArchitect() {
  const [genre, setGenre] = useState(GENRES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [premise, setPremise] = useState('');

  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [customChoice, setCustomChoice] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chapters, loading]);

  const handleStartStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!premise) {
      toast.error('Please describe the starting premise.');
      return;
    }
    setLoading(true);
    setChapters([]);
    try {
      const res = await contentService.generateStoryBranch({
        genre,
        tone,
        characters: characters ? characters.split(',').map(c => c.trim()) : undefined,
        setting: setting || undefined,
        previous_segments: [],
        choices_made: [],
        selected_choice: `Start story with premise: ${premise}`
      });

      setChapters([{
        segment: res.segment,
        choices: res.choices,
        analysis: res.analysis
      }]);
      toast.success('Story architecture initialized!');
    } catch (err: any) {
      toast.error('Failed to start story. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseBranch = async (choiceText: string) => {
    setLoading(true);
    // Set the choice made on the last chapter
    const updatedChapters = [...chapters];
    updatedChapters[updatedChapters.length - 1].choiceMade = choiceText;
    setChapters(updatedChapters);

    try {
      const previousSegments = chapters.map(c => c.segment);
      const choicesMade = chapters.map(c => c.choiceMade || '');

      const res = await contentService.generateStoryBranch({
        genre,
        tone,
        characters: characters ? characters.split(',').map(c => c.trim()) : undefined,
        setting: setting || undefined,
        previous_segments: previousSegments,
        choices_made: choicesMade,
        selected_choice: choiceText
      });

      setChapters([...updatedChapters, {
        segment: res.segment,
        choices: res.choices,
        analysis: res.analysis
      }]);
      setCustomChoice('');
      toast.success('Next chapter generated!');
    } catch (err: any) {
      toast.error('Failed to generate next chapter.');
    } finally {
      setLoading(false);
    }
  };

  const copyFullStory = () => {
    const fullText = chapters.map((c, idx) => `Chapter ${idx + 1}\n\n${c.segment}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    toast.success('Copied full story to clipboard!');
  };

  const downloadFullStory = () => {
    const fullText = chapters.map((c, idx) => `Chapter ${idx + 1}\n\n${c.segment}`).join('\n\n---\n\n');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `luminary-story-arc.txt`;
    a.click();
  };

  const currentChapter = chapters[chapters.length - 1];

  // SVG Chart Calculation
  const renderEmotionArc = () => {
    if (chapters.length < 2) return null;
    const emotionsToPlot = ['joy', 'sadness', 'fear', 'anger'];
    const colors: Record<string, string> = {
      joy: '#f59e0b',
      sadness: '#6366f1',
      fear: '#8b5cf6',
      anger: '#ef4444'
    };

    const width = 340;
    const height = 90;
    const padding = 15;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    const pointsCount = chapters.length;
    const stepX = pointsCount > 1 ? usableWidth / (pointsCount - 1) : usableWidth;

    return (
      <svg className="arc-line-svg" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Draw grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + usableHeight * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Plot emotion lines */}
        {emotionsToPlot.map((emotion) => {
          const coords = chapters.map((chap, idx) => {
            const val = chap.analysis.emotions?.[emotion] || 0;
            const x = padding + idx * stepX;
            const y = padding + usableHeight * (1 - val);
            return { x, y };
          });

          const pathD = coords.reduce((acc, coord, idx) => {
            return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
          }, '');

          return (
            <g key={emotion}>
              <path
                d={pathD}
                fill="none"
                stroke={colors[emotion]}
                strokeWidth="2"
                style={{ transition: 'all 0.5s ease' }}
              />
              {coords.map((coord, idx) => (
                <circle
                  key={idx}
                  cx={coord.x}
                  cy={coord.y}
                  r="3.5"
                  fill={colors[emotion]}
                  stroke="#fff"
                  strokeWidth="1.5"
                  title={`Chap ${idx + 1} ${emotion}: ${Math.round((chapters[idx].analysis.emotions?.[emotion] || 0) * 100)}%`}
                />
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="plot-architect-page">
      <div className="pa-layout">
        <div className="pa-form-panel">
          <div className="pa-panel-header">
            <div className="pa-panel-icon" style={{ background: '#eef0fe', color: '#5b6af0' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Plot Architect</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Build interactive branching narratives
              </p>
            </div>
          </div>

          {chapters.length === 0 ? (
            <form onSubmit={handleStartStory} className="pa-form">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Core Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Characters (optional)</label>
                <input
                  type="text"
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  placeholder="e.g. Leo (Soccer Coach), Sam (Striker)"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Setting (optional)</label>
                <input
                  type="text"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  placeholder="e.g. Rain-soaked stadium"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 500, fontSize: '0.85rem' }}>Opening Premise *</label>
                <textarea
                  value={premise}
                  onChange={(e) => setPremise(e.target.value)}
                  placeholder="Describe how the story begins..."
                  rows={4}
                  className="form-input"
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
              >
                {loading ? <><span className="spinner" /> Initializing...</> : <><Play size={14} /> Start Story Board</>}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <h4 style={{ fontWeight: 600, color: 'var(--color-text)' }}>Story Settings</h4>
                <div style={{ marginTop: '8px', color: 'var(--color-text-secondary)' }}>
                  <p><strong>Genre:</strong> {genre}</p>
                  <p><strong>Tone:</strong> {tone}</p>
                  {characters && <p><strong>Characters:</strong> {characters}</p>}
                  {setting && <p><strong>Setting:</strong> {setting}</p>}
                </div>
              </div>

              <div className="pa-form-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={copyFullStory} style={{ width: '100%' }}>
                  <Copy size={14} /> Copy Full Manuscript
                </button>
                <button className="btn btn-secondary" onClick={downloadFullStory} style={{ width: '100%' }}>
                  <Download size={14} /> Download Story
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setChapters([])}
                  style={{ width: '100%', border: '1px solid var(--color-border)', marginTop: '8px', color: 'var(--color-error)' }}
                >
                  <RotateCcw size={14} /> Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pa-output-panel">
          {chapters.length === 0 && !loading && (
            <div className="output-empty" style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Sparkles size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Interactive Storyboard Sandbox</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
                Configure the story context on the left, describe your setting, and watch the narrative unfold branch by branch.
              </span>
            </div>
          )}

          {chapters.length > 0 && (
            <div className="pa-output-content">
              {/* Timeline Header */}
              <div className="story-timeline">
                {chapters.map((_, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`timeline-step ${idx === chapters.length - 1 ? 'active' : ''}`}>
                      Chapter {idx + 1}
                    </div>
                    {idx < chapters.length - 1 && <span className="timeline-arrow">→</span>}
                  </div>
                ))}
              </div>

              {/* Manuscript Chapters list */}
              <div className="chapters-container">
                {chapters.map((chap, idx) => (
                  <div key={idx} className="chapter-card">
                    <div className="chapter-header">
                      <span>Chapter {idx + 1}</span>
                      {chap.choiceMade && (
                        <span className="chapter-choice-badge">
                          Action: {chap.choiceMade}
                        </span>
                      )}
                    </div>
                    <div className="chapter-body">{chap.segment}</div>
                  </div>
                ))}

                {loading && (
                  <div className="chapter-card" style={{ borderStyle: 'dashed', background: '#f8fafc' }}>
                    <div className="chapter-body" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)' }}>
                      <span className="spinner" />
                      Generating next plot point...
                    </div>
                  </div>
                )}
                <div ref={outputEndRef} />
              </div>

              {/* Dynamic Watson Dashboard */}
              {currentChapter && (
                <div className="analytics-dashboard">
                  <h4><Activity size={16} style={{ color: 'var(--color-accent)' }} /> Dynamic Narrative Emotional Arc</h4>
                  <div className="analytics-dashboard-grid">
                    {/* Chapter Emotion levels */}
                    <div className="emotion-chart-container">
                      <span className="emotion-chart-title">Current Chapter Tone</span>
                      <div className="emotion-bars">
                        {Object.entries(currentChapter.analysis.emotions || {}).map(([emotion, val]) => {
                          const colors: Record<string, string> = {
                            joy: '#f59e0b',
                            sadness: '#6366f1',
                            anger: '#ef4444',
                            fear: '#8b5cf6',
                            disgust: '#6b7280'
                          };
                          return (
                            <div key={emotion} className="emotion-bar-row">
                              <span className="emotion-name">{emotion}</span>
                              <div className="emotion-bar-outer">
                                <div
                                  className="emotion-bar-inner"
                                  style={{
                                    width: `${Math.round(val * 100)}%`,
                                    background: colors[emotion] || '#a855f7'
                                  }}
                                />
                              </div>
                              <span className="emotion-percent">{Math.round(val * 100)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline Line Chart */}
                    <div className="story-arc-chart">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="emotion-chart-title">Emotional Arc (Chapters 1-{chapters.length})</span>
                        <div style={{ display: 'flex', gap: '6px', fontSize: '9px' }}>
                          <span style={{ color: '#f59e0b' }}>● Joy</span>
                          <span style={{ color: '#6366f1' }}>● Sad</span>
                          <span style={{ color: '#8b5cf6' }}>● Fear</span>
                          <span style={{ color: '#ef4444' }}>● Anger</span>
                        </div>
                      </div>
                      <div className="arc-dots">
                        {renderEmotionArc()}
                        {chapters.length < 2 && (
                          <div style={{ position: 'absolute', top: '35%', left: '0', width: '100%', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Generate Chapter 2 to visualize the emotional arc.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '8px' }}>
                    <WatsonBadge analysis={currentChapter.analysis} compact />
                  </div>
                </div>
              )}

              {/* Branch Decision Panel */}
              {!loading && currentChapter && currentChapter.choices && (
                <div className="choices-panel">
                  <h3>Select the next path for the story:</h3>
                  <div className="choices-grid">
                    {currentChapter.choices.slice(0, 3).map((choice, idx) => (
                      <button
                        key={idx}
                        className="choice-btn"
                        onClick={() => handleChooseBranch(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>

                  <div className="custom-choice-input">
                    <input
                      type="text"
                      value={customChoice}
                      onChange={(e) => setCustomChoice(e.target.value)}
                      placeholder="Or enter your own custom plot path, e.g. They decide to escape out of the window..."
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleChooseBranch(customChoice)}
                      disabled={!customChoice.trim()}
                      style={{ background: 'var(--color-accent)', color: '#fff', border: 'none' }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
