import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useDemoLogin } from '../hooks/useDemoLogin';
import type { LoginForm } from '../types';
import '../styles/Login.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { loginAsDemo, loading: demoLoading } = useDemoLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.access_token, res.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const anyLoading = loading || demoLoading;

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
          <h1>Welcome Back</h1>
          <p>Log in to continue your creative journey</p>
        </div>

        {/* Demo login banner */}
        <button
          type="button"
          className="demo-btn"
          onClick={loginAsDemo}
          disabled={anyLoading}
        >
          <span className="demo-btn__icon"><Zap size={15} /></span>
          <span className="demo-btn__text">
            <strong>Try Demo</strong>
            <span>Instant access — no account needed</span>
          </span>
          {demoLoading
            ? <span className="spinner" />
            : <ArrowRight size={15} className="demo-btn__arrow" />}
        </button>

        <div className="auth-divider">
          <span>or sign in with your account</span>
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

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={anyLoading}>
            {loading ? <span className="spinner" /> : 'Log In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="auth-bg" />
    </div>
  );
}
