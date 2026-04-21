import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const INTENTS = ['Serious', 'Casual', 'Exploring', 'Healing'];

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: '', intent: 'Serious',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/users/register', formData);
      localStorage.setItem('tangle_token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/20 outline-none focus:border-[#e8547a]/50 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0710] via-[#120d18] to-[#1a0f28] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8547a] to-[#9b59b6] flex items-center justify-center text-white text-xl font-bold mb-4">
            T
          </div>
          <h1 className="text-white font-serif text-2xl font-semibold">Create your profile</h1>
          <p className="text-white/40 text-sm mt-1">Join Tangle</p>
        </div>

        <div className="bg-[#16101d] border border-white/10 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className={inputClass} />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" required className={inputClass} />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Gender</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="How you identify" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Looking for</label>
              <div className="grid grid-cols-2 gap-2">
                {INTENTS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setFormData({ ...formData, intent: option })}
                    className={`py-2.5 rounded-xl text-sm transition-colors ${
                      formData.intent === option
                        ? 'bg-[#e8547a] text-white'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e8547a] to-[#c0395e] text-white py-3 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#e8547a] hover:text-[#f2a0b0] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
