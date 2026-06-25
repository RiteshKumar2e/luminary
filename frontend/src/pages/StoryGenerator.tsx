import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  BookOpen, Send, Download, Copy, RotateCcw,
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { WatsonBadge } from '../components/WatsonBadge';
import type { GenerationResult } from '../types';
import '../styles/StoryGenerator.css';

const storySchema = z.object({
  title: z.string().optional(),
  genre: z.string().min(1),
  tone: z.string().min(1),
  length: z.enum(['short', 'medium', 'long']),
  prompt: z.string().min(10, 'Please describe your story idea (10+ chars)'),
  characters: z.string().optional(),
  setting: z.string().optional(),
});

type StoryForm = z.infer<typeof storySchema>;

const GENRES = ['Fantasy', 'Sci-Fi', 'Romance', 'Thriller', 'Horror', 'Adventure', 'Mystery', 'Literary Fiction', 'Historical', 'General'];
const TONES = ['Hopeful', 'Dark', 'Humorous', 'Suspenseful', 'Romantic', 'Melancholic', 'Inspiring', 'Neutral'];

export default function StoryGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StoryForm>({
    resolver: zodResolver(storySchema),
    defaultValues: { genre: 'Fantasy', tone: 'Hopeful', length: 'medium' },
  });

  const onSubmit = async (data: StoryForm) => {
    setLoading(true);
    try {
      const res = await contentService.generateStory({
        ...data,
        characters: data.characters
          ? data.characters.split(',').map((c) => c.trim())
          : undefined,
      });
      setResult(res);
      toast.success('Story generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      toast.success('Copied to clipboard!');
    }
  };

  const downloadContent = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'luminary-story.txt';
    a.click();
  };

  return (
    <div className="story-page">
      <div className="sg-layout">
        <div className="sg-form-panel">
          <div className="sg-panel-header">
            <div className="sg-panel-icon" style={{ background: '#eef0fe', color: '#5b6af0' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2>Story Generator</h2>
              <p>Craft compelling narratives with AI</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="sg-form">
            <div className="form-group">
              <label className="form-label">Story Title (optional)</label>
              <input {...register('title')} type="text" placeholder="My Epic Adventure" className="form-input" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Genre</label>
                <select {...register('genre')} className="form-input">
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tone</label>
                <select {...register('tone')} className="form-input">
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Story Length</label>
              <div className="length-options">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <label key={l} className="length-option">
                    <input type="radio" {...register('length')} value={l} />
                    <span>
                      {l === 'short' ? '300–500w' : l === 'medium' ? '600–900w' : '1000–1500w'}
                    </span>
                    <small>{l.charAt(0).toUpperCase() + l.slice(1)}</small>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Story Premise *</label>
              <textarea
                {...register('prompt')}
                rows={4}
                placeholder="Describe your story idea... e.g. A young wizard discovers she has the power to rewind time, but each use costs a memory."
                className={`form-input${errors.prompt ? ' error' : ''}`}
              />
              {errors.prompt && <span className="form-error">{errors.prompt.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Characters (comma-separated, optional)</label>
              <input {...register('characters')} type="text" placeholder="Aria, The Keeper, Marcus" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Setting (optional)</label>
              <input {...register('setting')} type="text" placeholder="A dystopian city in 2140" className="form-input" />
            </div>

            <div className="sg-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setResult(null); }}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Generating...</> : <><Send size={16} /> Generate Story</>}
              </button>
            </div>
          </form>
        </div>

        <div className="sg-output-panel">
          {loading && (
            <div className="output-loading">
              <div className="spinner spinner-lg" />
              <p>Generating your story with Groq LLaMA 3...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="output-empty">
              <BookOpen size={48} />
              <p>Your story will appear here</p>
              <span>Fill in the form and click Generate Story</span>
            </div>
          )}

          {!loading && result && (
            <motion.div
              className="output-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="output-actions">
                <span className="output-meta">{result.tokens_used} tokens</span>
                <div className="output-btns">
                  <button className="btn btn-secondary btn-sm" onClick={copyContent}>
                    <Copy size={14} /> Copy
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={downloadContent}>
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>

              <pre className="output-text">{result.content}</pre>

              {result.analysis && (
                <div className="output-analysis">
                  <WatsonBadge analysis={result.analysis} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
