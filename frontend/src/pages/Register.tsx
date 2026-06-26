import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserCircle, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { RegisterForm } from '../types';
import '../styles/Register.css';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be 3+ characters'),
  full_name: z.string().min(2, 'Full name required'),
  password: z.string().min(6, 'Password must be 6-10 characters').max(10, 'Password must be 6-10 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
  industry: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormFields = z.infer<typeof registerSchema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormFields) => {
    setLoading(true);
    try {
      const { confirm_password, ...payload } = data;
      const res = await authService.register(payload);
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={14} /> Password
              </label>
              <div className="password-input-container">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`form-input${errors.password ? ' error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="form-label">
                <Lock size={14} /> Confirm Password
              </label>
              <div className="password-input-container">
                <input
                  {...register('confirm_password')}
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`form-input${errors.confirm_password ? ' error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password.message}</span>}
            </div>
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
