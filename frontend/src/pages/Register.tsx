import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { RegisterForm } from '../types';
import '../styles/Register.css';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be 3+ characters'),
  full_name: z.string().min(2, 'Full name required'),
  password: z.string().min(8, 'Password must be 8+ characters'),
  industry: z.string().optional(),
});

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      login(res.access_token, res.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-home-btn">
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>
      <div className="auth-card">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">
            <span className="logo-mark">✦</span>
            <span>Luminary</span>
          </Link>
          <h1>Create Account</h1>
          <p>Start creating with AI-powered intelligence</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={14} /> Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`form-input${errors.email ? ' error' : ''}`}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={14} /> Username
            </label>
            <input
              {...register('username')}
              id="username"
              type="text"
              placeholder="yourname"
              className={`form-input${errors.username ? ' error' : ''}`}
            />
            {errors.username && <span className="form-error">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="full_name" className="form-label">
              <UserCircle size={14} /> Full Name
            </label>
            <input
              {...register('full_name')}
              id="full_name"
              type="text"
              placeholder="Your Full Name"
              className={`form-input${errors.full_name ? ' error' : ''}`}
            />
            {errors.full_name && <span className="form-error">{errors.full_name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={14} /> Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="••••••••"
              className={`form-input${errors.password ? ' error' : ''}`}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="industry" className="form-label">Industry (optional)</label>
            <input
              {...register('industry')}
              id="industry"
              type="text"
              placeholder="e.g. Marketing, Design, Content"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </div>

      <div className="auth-bg" />
    </div>
  );
}
