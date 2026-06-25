import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Palette, Send, Copy, Download, RotateCcw, Plus, X } from 'lucide-react';
import { contentService } from '../services/contentService';
import { WatsonBadge } from '../components/WatsonBadge';
import type { GenerationResult } from '../types';
import '../styles/BrandKit.css';

const brandKitSchema = z.object({
  brand_name: z.string().min(1, 'Brand name required'),
  industry: z.string().min(1, 'Industry required'),
  brand_personality: z.string().min(5, 'Describe your brand personality'),
  target_audience: z.string().min(5, 'Describe your target audience'),
  values: z.array(z.string()),
});

type BrandKitForm = z.infer<typeof brandKitSchema>;

const INDUSTRIES = ['Technology', 'Fashion', 'Food & Beverage', 'Health & Wellness', 'Finance', 'Education', 'Entertainment', 'Travel', 'Real Estate', 'Retail', 'Non-profit', 'Other'];

export default function BrandKit() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [newValue, setNewValue] = useState('');

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<BrandKitForm>({
    resolver: zodResolver(brandKitSchema),
    defaultValues: { industry: 'Technology', values: [] },
  });

  const values = watch('values');

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValue('values', [...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const removeValue = (v: string) => setValue('values', values.filter((val) => val !== v));

  const onSubmit = async (data: BrandKitForm) => {
    setLoading(true);
    try {
      const res = await contentService.generateBrandKit(data);
      setResult(res);
      toast.success('Brand kit generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    if (result) { navigator.clipboard.writeText(result.content); toast.success('Copied!'); }
  };
  const downloadContent = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'luminary-brand-kit.txt';
    a.click();
  };

  return (
    <div className="brand-kit-page">
      <div className="bk-layout">
        <div className="bk-form-panel">
          <div className="bk-panel-header">
            <div className="bk-panel-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
              <Palette size={20} />
            </div>
            <div>
              <h2>Brand Kit Generator</h2>
              <p>Build your complete brand identity</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bk-form">
            <div className="form-group">
              <label className="form-label">Brand Name *</label>
              <input {...register('brand_name')} className={`form-input${errors.brand_name ? ' error' : ''}`} placeholder="Your Brand Name" />
              {errors.brand_name && <span className="form-error">{errors.brand_name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Industry *</label>
              <select {...register('industry')} className="form-input">
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Personality *</label>
              <textarea
                {...register('brand_personality')}
                rows={2}
                className={`form-input${errors.brand_personality ? ' error' : ''}`}
                placeholder="Bold and disruptive, empathetic and human, minimal and sophisticated..."
              />
              {errors.brand_personality && <span className="form-error">{errors.brand_personality.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience *</label>
              <textarea
                {...register('target_audience')}
                rows={2}
                className={`form-input${errors.target_audience ? ' error' : ''}`}
                placeholder="Age, profession, interests, values, pain points..."
              />
              {errors.target_audience && <span className="form-error">{errors.target_audience.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Core Values (optional)</label>
              <div className="values-input">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  className="form-input"
                  placeholder="Type a value and press Enter"
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={addValue}>
                  <Plus size={14} />
                </button>
              </div>
              <div className="values-tags">
                {values.map((v) => (
                  <span key={v} className="value-tag">
                    {v}
                    <button type="button" onClick={() => removeValue(v)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bk-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setResult(null); }}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Generating...</> : <><Send size={16} /> Generate Kit</>}
              </button>
            </div>
          </form>
        </div>

        <div className="bk-output-panel">
          {loading && (
            <div className="output-loading">
              <div className="spinner spinner-lg" />
              <p>Building your brand identity...</p>
            </div>
          )}
          {!loading && !result && (
            <div className="output-empty">
              <Palette size={48} />
              <p>Brand kit will appear here</p>
              <span>Fill in the form and click Generate Kit</span>
            </div>
          )}
          {!loading && result && (
            <motion.div className="output-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="output-actions">
                <span className="output-meta">{result.tokens_used} tokens</span>
                <div className="output-btns">
                  <button className="btn btn-secondary btn-sm" onClick={copyContent}><Copy size={14} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={downloadContent}><Download size={14} /> Download</button>
                </div>
              </div>
              <pre className="output-text">{result.content}</pre>
              {result.analysis && <div className="output-analysis"><WatsonBadge analysis={result.analysis} /></div>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
