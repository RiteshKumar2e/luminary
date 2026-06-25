import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { DEMO_USER, DEMO_TOKEN } from '../utils/demoUser';

export function useDemoLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginAsDemo = async () => {
    setLoading(true);
    // Small delay so it feels responsive, not instant
    await new Promise((r) => setTimeout(r, 700));
    login(DEMO_TOKEN, DEMO_USER);
    toast.success('Welcome to Luminary AI — Demo Mode ✦', { duration: 3000 });
    navigate('/dashboard');
    setLoading(false);
  };

  return { loginAsDemo, loading };
}
