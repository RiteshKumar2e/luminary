import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Upload, Trash2, Image, FileText, Download, Plus, Grid, List } from 'lucide-react';
import { assetService } from '../services/assetService';
import type { Asset } from '../types';
import '../styles/AssetLibrary.css';

const CATEGORIES = ['All', 'image', 'document', 'text', 'copy', 'logo', 'other'];

export default function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async (cat: string) => {
    setLoading(true);
    try {
      const res = await assetService.listAssets({ category: cat === 'All' ? undefined : cat, limit: 50 });
      setAssets(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(category); }, [category]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const asset = await assetService.uploadAsset(file, { category: 'other' });
      setAssets((prev) => [asset, ...prev]);
      toast.success('Uploaded!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await assetService.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (a: Asset) => {
    if (a.file_type === 'image') return <Image size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div className="assets-page">
      <div className="assets-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Asset Library</h1>
          <p>{total} assets stored</p>
        </div>
        <div className="assets-header__actions">
          <button className="btn btn-secondary" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <List size={16} /> : <Grid size={16} />}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <span className="spinner" /> : <><Upload size={16} /> Upload</>}
          </button>
          <input ref={fileRef} type="file" onChange={handleUpload} className="sr-only" accept="image/*,.pdf,.txt,.json" />
        </div>
      </div>

      <div className="assets-categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-btn${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c === 'All' ? 'All' : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : assets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Upload size={24} /></div>
          <h3>No assets yet</h3>
          <p>Upload files or save generated content as assets.</p>
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            <Plus size={16} /> Upload First Asset
          </button>
        </div>
      ) : (
        <div className={`assets-${view}`}>
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              className="asset-card"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className={`asset-card__preview${asset.file_type === 'image' && asset.file_url ? ' has-image' : ''}`}>
                {asset.file_type === 'image' && asset.file_url ? (
                  <img src={asset.file_url} alt={asset.name} />
                ) : (
                  <div className="asset-card__file-icon">{getIcon(asset)}</div>
                )}
                {asset.is_ai_generated && <span className="asset-ai-tag">AI</span>}
              </div>
              <div className="asset-card__info">
                <p className="asset-card__name">{asset.name}</p>
                <p className="asset-card__meta">
                  {asset.category} · {asset.file_type}
                  {asset.file_size > 0 && ` · ${(asset.file_size / 1024).toFixed(1)}KB`}
                </p>
              </div>
              <div className="asset-card__actions">
                {asset.file_url && (
                  <a href={asset.file_url} download className="btn btn-ghost btn-sm">
                    <Download size={14} />
                  </a>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(asset.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
