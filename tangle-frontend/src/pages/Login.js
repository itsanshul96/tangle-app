import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/users/login', formData);
      localStorage.setItem('tangle_token', res.data.token);
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      navigate(adminEmail && formData.email === adminEmail ? '/admin' : '/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0710] via-[#120d18] to-[#1a0f28] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8547a] to-[#9b59b6] flex items-center justify-center text-white text-xl font-bold mb-4">
            T
          </div>
          <h1 className="text-white font-serif text-2xl font-semibold">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to Tangle</p>
        </div>

        <div className="bg-[#16101d] border border-white/10 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/20 outline-none focus:border-[#e8547a]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/20 outline-none focus:border-[#e8547a]/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e8547a] to-[#c0395e] text-white py-3 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#e8547a] hover:text-[#f2a0b0] transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
