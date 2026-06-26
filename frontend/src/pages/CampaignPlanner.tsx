import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Megaphone, Send, Copy, Download, RotateCcw } from 'lucide-react';
import { contentService } from '../services/contentService';
import { WatsonBadge } from '../components/WatsonBadge';
import type { GenerationResult } from '../types';
import '../styles/CampaignPlanner.css';

const campaignSchema = z.object({
  brand_name: z.string().min(1, 'Brand name required'),
  product: z.string().min(1, 'Product/service required'),
  target_audience: z.string().min(5, 'Describe your target audience'),
  campaign_goal: z.string().min(5, 'Describe your campaign goal'),
  tone: z.string().min(1),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  budget_level: z.string(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube', 'Facebook', 'Email'];
const TONES = ['Professional', 'Playful', 'Inspirational', 'Urgent', 'Empathetic', 'Bold'];
const BUDGETS = [
  { value: 'low', label: '< $5K/mo' },
  { value: 'medium', label: '$5K–$50K/mo' },
  { value: 'high', label: '$50K+/mo' },
];

export default function CampaignPlanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: { tone: 'Professional', platforms: ['Instagram'], budget_level: 'medium' },
  });

  const onSubmit = async (data: CampaignForm) => {
    setLoading(true);
    try {
      const res = await contentService.generateCampaign(data);
      setResult(res);
      toast.success('Campaign generated!');
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
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
    a.download = 'luminary-campaign.txt';
    a.click();
  };

  return (
    <div className="campaign-page">
      <div className="cp-layout">
        <div className="cp-form-panel">
          <div className="cp-panel-header">
            <div className="cp-panel-icon" style={{ background: '#f0ebfc', color: '#7c5cd8' }}>
              <Megaphone size={20} />
            </div>
            <div>
              <h2>Campaign Planner</h2>
              <p>Build complete marketing campaigns</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="cp-form">
            <div className="form-group">
              <label className="form-label">Brand Name *</label>
              <input {...register('brand_name')} className={`form-input${errors.brand_name ? ' error' : ''}`} placeholder="Nike, Acme Co." />
              {errors.brand_name && <span className="form-error">{errors.brand_name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Product / Service *</label>
              <input {...register('product')} className={`form-input${errors.product ? ' error' : ''}`} placeholder="Running shoes, SaaS platform..." />
              {errors.product && <span className="form-error">{errors.product.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience *</label>
              <input {...register('target_audience')} className={`form-input${errors.target_audience ? ' error' : ''}`} placeholder="Gen Z fitness enthusiasts, B2B SaaS buyers..." />
              {errors.target_audience && <span className="form-error">{errors.target_audience.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Goal *</label>
              <textarea {...register('campaign_goal')} rows={2} className={`form-input${errors.campaign_goal ? ' error' : ''}`} placeholder="Increase brand awareness by 30%, drive 1000 sign-ups..." />
              {errors.campaign_goal && <span className="form-error">{errors.campaign_goal.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tone</label>
                <select {...register('tone')} className="form-input">
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Budget Level</label>
                <select {...register('budget_level')} className="form-input">
                  {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Platforms *</label>
              <Controller
                name="platforms"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="platform-grid">
                    {PLATFORMS.map((p) => {
                      const checked = value.includes(p);
                      return (
                        <button
                          type="button"
                          key={p}
                          className={`platform-btn${checked ? ' active' : ''}`}
                          onClick={() => onChange(checked ? value.filter((v) => v !== p) : [...value, p])}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.platforms && <span className="form-error">{errors.platforms.message}</span>}
            </div>

            <div className="cp-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); setResult(null); }}>
                <RotateCcw size={16} /> Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Generating...</> : <><Send size={16} /> Generate Campaign</>}
              </button>
            </div>
          </form>
        </div>

        <div className="cp-output-panel" ref={outputRef}>
          {loading && (
            <div className="output-loading">
              <div className="spinner spinner-lg" />
              <p>Building your campaign strategy...</p>
            </div>
          )}
          {!loading && !result && (
            <div className="output-empty">
              <Megaphone size={48} />
              <p>Campaign plan will appear here</p>
              <span>Complete the form and click Generate Campaign</span>
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
