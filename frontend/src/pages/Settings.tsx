import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Lock, Mail, Briefcase, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/Settings.css';

const profileSchema = z.object({
  full_name: z.string().min(2),
  bio: z.string().max(300).optional(),
  industry: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(6, 'Password must be 6-10 characters').max(10, 'Password must be 6-10 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
      industry: user?.industry || '',
    },
  });

  const pwdForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileLoading(true);
    try {
      await authService.updateProfile(data);
      await refreshUser();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPwdLoading(true);
    try {
      await authService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success('Password changed!');
      pwdForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        <aside className="settings-nav">
          <h2>Settings</h2>
          <nav>
            <a href="#profile" className="settings-nav-item active">Profile</a>
            <a href="#security" className="settings-nav-item">Security</a>
            <a href="#account" className="settings-nav-item">Account</a>
          </nav>
        </aside>

        <div className="settings-content">
          {/* Profile Section */}
          <section id="profile" className="settings-section">
            <div className="settings-section__header">
              <div className="settings-section__icon"><User size={18} /></div>
              <div>
                <h3>Profile Information</h3>
                <p>Update your name, bio, and industry</p>
              </div>
            </div>

            <div className="settings-user-info">
              <div className="settings-avatar">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="settings-name">{user?.full_name}</p>
                <p className="settings-email">{user?.email}</p>
                <span className="badge badge-accent">{user?.plan} plan</span>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="settings-form">
              <div className="form-group">
                <label className="form-label"><User size={13} /> Full Name</label>
                <input
                  {...profileForm.register('full_name')}
                  className={`form-input${profileForm.formState.errors.full_name ? ' error' : ''}`}
                />
                {profileForm.formState.errors.full_name && (
                  <span className="form-error">{profileForm.formState.errors.full_name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label"><Briefcase size={13} /> Industry</label>
                <input {...profileForm.register('industry')} className="form-input" placeholder="Marketing, Design, Content..." />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea {...profileForm.register('bio')} rows={3} className="form-input" placeholder="Tell us a bit about yourself..." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? <span className="spinner" /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </section>

          <hr className="divider" />

          {/* Password Section */}
          <section id="security" className="settings-section">
            <div className="settings-section__header">
              <div className="settings-section__icon"><Lock size={18} /></div>
              <div>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>
            </div>

            <form onSubmit={pwdForm.handleSubmit(onPasswordSubmit)} className="settings-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  {...pwdForm.register('current_password')}
                  type="password"
                  className={`form-input${pwdForm.formState.errors.current_password ? ' error' : ''}`}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  {...pwdForm.register('new_password')}
                  type="password"
                  className={`form-input${pwdForm.formState.errors.new_password ? ' error' : ''}`}
                />
                {pwdForm.formState.errors.new_password && (
                  <span className="form-error">{pwdForm.formState.errors.new_password.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  {...pwdForm.register('confirm_password')}
                  type="password"
                  className={`form-input${pwdForm.formState.errors.confirm_password ? ' error' : ''}`}
                />
                {pwdForm.formState.errors.confirm_password && (
                  <span className="form-error">{pwdForm.formState.errors.confirm_password.message}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={pwdLoading}>
                {pwdLoading ? <span className="spinner" /> : <Lock size={16} />}
                Update Password
              </button>
            </form>
          </section>

          <hr className="divider" />

          {/* Account Info */}
          <section id="account" className="settings-section">
            <div className="settings-section__header">
              <div className="settings-section__icon"><Mail size={18} /></div>
              <div>
                <h3>Account Details</h3>
                <p>Your account information</p>
              </div>
            </div>
            <div className="account-info-grid">
              <div className="account-info-item">
                <span className="account-info-label">Email</span>
                <span className="account-info-value">{user?.email}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Username</span>
                <span className="account-info-value">@{user?.username}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Plan</span>
                <span className="account-info-value" style={{ textTransform: 'capitalize' }}>{user?.plan}</span>
              </div>
              <div className="account-info-item">
                <span className="account-info-label">Member Since</span>
                <span className="account-info-value">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
