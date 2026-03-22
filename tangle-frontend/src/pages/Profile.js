import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    intent: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/me');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        age: res.data.age || '',
        gender: res.data.gender || '',
        intent: res.data.intent || '',
      });
    } catch (err) {
      setError('Unauthorized. Please login again.');
      localStorage.removeItem('tangle_token');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/me', formData);
      setProfile(res.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (!profile) return <div className="flex items-center justify-center h-screen text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-rose-600 mb-2">My Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Email: {profile.email}</p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="text"
            name="gender"
            value={formData.gender}
            placeholder="Gender"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="text"
            name="intent"
            value={formData.intent}
            placeholder="Intent (e.g., long-term, casual)"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-xl transition duration-300"
          >
            Update Profile
          </button>
        </form>

        <button
          className="mt-6 w-full text-sm text-gray-600 hover:text-rose-500"
          onClick={() => {
            localStorage.removeItem('tangle_token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
