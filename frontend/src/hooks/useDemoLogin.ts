import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const DEMO_EMAIL = 'demo@luminary.ai';
const DEMO_PASSWORD = 'Demo@Luminary2026!';

export function useDemoLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      // Try login first (works if demo account already exists)
      let res = await authService.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD }).catch(
        async () => {
          // Account doesn't exist yet — register it
          await authService.register({
            email: DEMO_EMAIL,
            username: 'demo_user',
            full_name: 'Demo User',
            password: DEMO_PASSWORD,
            industry: 'Creative',
          });
          // Now login with the newly created account
          return authService.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
        }
      );
      login(res.access_token, res.user);
      toast.success('Welcome to Luminary AI — Demo Mode ✦', { duration: 3000 });
      navigate('/dashboard');
    } catch {
      toast.error('Demo login failed. Please register a real account.');
    } finally {
      setLoading(false);
    }
  };

  return { loginAsDemo, loading };
}
