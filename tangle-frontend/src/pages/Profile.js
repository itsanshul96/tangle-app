import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const INTENTS = ['Serious', 'Casual', 'Exploring', 'Healing'];

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', intent: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setProfile(res.data);
        setFormData({
          name:   res.data.name   || '',
          age:    res.data.age    || '',
          gender: res.data.gender || '',
          intent: res.data.intent || 'Serious',
        });
      } catch {
        localStorage.removeItem('tangle_token');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/users/me', formData);
      setProfile(res.data);
      setMessage('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/20 outline-none focus:border-[#e8547a]/50 transition-colors";

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0710] via-[#120d18] to-[#1a0f28] flex items-center justify-center">
        <p className="text-white/30 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0710] via-[#120d18] to-[#1a0f28] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8547a] to-[#9b59b6] flex items-center justify-center text-white text-xl font-bold mb-4">
            {profile.name?.[0]?.toUpperCase() || 'T'}
          </div>
          <h1 className="text-white font-serif text-2xl font-semibold">{profile.name}</h1>
          <p className="text-white/40 text-sm mt-1">{profile.email}</p>
        </div>

        <div className="bg-[#16101d] border border-white/10 rounded-2xl p-6">
          {message && (
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-teal-400 text-sm">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" className={inputClass} />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Gender</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="How you identify" className={inputClass} />
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
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#e8547a] to-[#c0395e] text-white py-3 rounded-xl font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            to="/admin"
            className="block text-center text-white/20 hover:text-white/40 text-xs transition-colors py-2"
          >
            Admin Dashboard →
          </Link>
          <button
            onClick={() => { localStorage.removeItem('tangle_token'); navigate('/login'); }}
            className="w-full text-center text-white/30 hover:text-white/50 text-sm transition-colors py-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
