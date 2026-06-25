import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Sparkles, MessageSquare, Clapperboard, Lightbulb, Copy,
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { WatsonBadge } from '../components/WatsonBadge';
import type { GenerationResult } from '../types';
import '../styles/CreativeStudio.css';

const STUDIO_TABS = [
  { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb },
  { id: 'caption', label: 'Captions', icon: MessageSquare },
  { id: 'script', label: 'Script', icon: Clapperboard },
  { id: 'analyze', label: 'Analyze Text', icon: Sparkles },
];

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Facebook'];
const TONES = ['Engaging', 'Professional', 'Playful', 'Inspirational', 'Witty', 'Empathetic'];
const SCRIPT_TYPES = ['YouTube Video', 'TikTok Reel', 'Ad', 'Podcast Intro', 'Explainer'];

export default function CreativeStudio() {
  const [activeTab, setActiveTab] = useState('brainstorm');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | { content: string; analysis: any } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const { register, handleSubmit, reset } = useForm<any>();

  const copyContent = () => {
    const c = (result as any)?.content;
    if (c) { navigator.clipboard.writeText(c); toast.success('Copied!'); }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    reset();
    setResult(null);
    setAnalysisResult(null);
  };

  const onBrainstormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await contentService.brainstorm(data.topic, data.category || 'general', data.count || 8);
      setResult(res);
      toast.success('Ideas generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally { setLoading(false); }
  };

  const onCaptionSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await contentService.generateCaptions({
        platform: data.platform,
        content_description: data.content_description,
        tone: data.tone || 'engaging',
        include_hashtags: data.include_hashtags === 'true' || data.include_hashtags === true,
        count: parseInt(data.count || '3'),
      });
      setResult(res);
      toast.success('Captions generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally { setLoading(false); }
  };

  const onScriptSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await contentService.generateScript({
        script_type: data.script_type,
        topic: data.topic,
        duration_seconds: parseInt(data.duration_seconds || '60'),
        tone: data.tone || 'conversational',
        target_audience: data.target_audience || undefined,
      });
      setResult(res);
      toast.success('Script generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally { setLoading(false); }
  };

  const onAnalyzeSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await contentService.analyzeContent(data.text);
      setAnalysisResult(res.analysis);
      toast.success('Analysis complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="studio-page">
      <div className="studio-tabs">
        {STUDIO_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`studio-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => handleTabChange(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="studio-layout">
        <div className="studio-form-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'brainstorm' && (
                <form onSubmit={handleSubmit(onBrainstormSubmit)} className="studio-form">
                  <h3>Idea Brainstorm</h3>
                  <p className="studio-form__sub">Generate multiple creative ideas on any topic</p>
                  <div className="form-group">
                    <label className="form-label">Topic or Theme *</label>
                    <input {...register('topic', { required: true })} className="form-input" placeholder="Sustainable fashion, AI in healthcare..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input {...register('category')} className="form-input" placeholder="Marketing, Product, Story..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Number of Ideas</label>
                      <select {...register('count')} className="form-input">
                        <option value="5">5 ideas</option>
                        <option value="8" selected>8 ideas</option>
                        <option value="12">12 ideas</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? <><span className="spinner" /> Brainstorming...</> : <><Lightbulb size={16} /> Generate Ideas</>}
                  </button>
                </form>
              )}

              {activeTab === 'caption' && (
                <form onSubmit={handleSubmit(onCaptionSubmit)} className="studio-form">
                  <h3>Caption Generator</h3>
                  <p className="studio-form__sub">Platform-optimized social media captions</p>
                  <div className="form-group">
                    <label className="form-label">Platform *</label>
                    <select {...register('platform', { required: true })} className="form-input">
                      {PLATFORMS.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content Description *</label>
                    <textarea {...register('content_description', { required: true })} rows={3} className="form-input" placeholder="Describe what your post is about..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tone</label>
                      <select {...register('tone')} className="form-input">
                        {TONES.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Count</label>
                      <select {...register('count')} className="form-input">
                        <option value="2">2</option>
                        <option value="3" selected>3</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Include Hashtags?</label>
                    <select {...register('include_hashtags')} className="form-input">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? <><span className="spinner" /> Generating...</> : <><MessageSquare size={16} /> Generate Captions</>}
                  </button>
                </form>
              )}

              {activeTab === 'script' && (
                <form onSubmit={handleSubmit(onScriptSubmit)} className="studio-form">
                  <h3>Script Writer</h3>
                  <p className="studio-form__sub">Scripts for videos, podcasts, and ads</p>
                  <div className="form-group">
                    <label className="form-label">Script Type *</label>
                    <select {...register('script_type', { required: true })} className="form-input">
                      {SCRIPT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Topic *</label>
                    <input {...register('topic', { required: true })} className="form-input" placeholder="What is the script about?" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Duration (seconds)</label>
                      <select {...register('duration_seconds')} className="form-input">
                        <option value="30">30s</option>
                        <option value="60" selected>60s</option>
                        <option value="120">2 min</option>
                        <option value="300">5 min</option>
                        <option value="600">10 min</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tone</label>
                      <select {...register('tone')} className="form-input">
                        {TONES.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <input {...register('target_audience')} className="form-input" placeholder="Gen Z, professionals, parents..." />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? <><span className="spinner" /> Writing Script...</> : <><Clapperboard size={16} /> Write Script</>}
                  </button>
                </form>
              )}

              {activeTab === 'analyze' && (
                <form onSubmit={handleSubmit(onAnalyzeSubmit)} className="studio-form">
                  <h3>Content Analyzer</h3>
                  <p className="studio-form__sub">IBM Watson NLU — tone, emotion &amp; quality</p>
                  <div className="form-group">
                    <label className="form-label">Paste your content *</label>
                    <textarea {...register('text', { required: true })} rows={8} className="form-input" placeholder="Paste any text to analyze tone, emotion, sentiment, quality score, keywords, and entities..." />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? <><span className="spinner" /> Analyzing...</> : <><Sparkles size={16} /> Analyze with Watson</>}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="studio-output-panel">
          {loading && (
            <div className="output-loading">
              <div className="spinner spinner-lg" />
              <p>Processing with AI...</p>
            </div>
          )}

          {!loading && !result && !analysisResult && (
            <div className="output-empty">
              <Sparkles size={48} />
              <p>Output will appear here</p>
              <span>Select a tool and generate content</span>
            </div>
          )}

          {!loading && result && (
            <motion.div className="output-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="output-actions">
                <span className="output-meta">{(result as any).tokens_used || 0} tokens</span>
                <div className="output-btns">
                  <button className="btn btn-secondary btn-sm" onClick={copyContent}><Copy size={14} /> Copy</button>
                </div>
              </div>
              <pre className="output-text">{(result as any).content}</pre>
            </motion.div>
          )}

          {!loading && analysisResult && (
            <motion.div className="output-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="output-analysis">
                <WatsonBadge analysis={analysisResult} />
              </div>
              {analysisResult.word_count && (
                <div className="analysis-extra">
                  <div className="analysis-stat"><span>Words</span><strong>{analysisResult.word_count}</strong></div>
                  <div className="analysis-stat"><span>Dominant Emotion</span><strong style={{ textTransform: 'capitalize' }}>{analysisResult.dominant_emotion}</strong></div>
                  {analysisResult.readability && (
                    <div className="analysis-stat"><span>Readability</span><strong style={{ textTransform: 'capitalize' }}>{analysisResult.readability}</strong></div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
