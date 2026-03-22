import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Logo from '../assets/brandLogo.png'; // Assuming you have added a soft background logo

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    intent: 'Undecided',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIntentClick = (intentValue) => {
    setFormData({ ...formData, intent: intentValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', formData);
      localStorage.setItem('tangle_token', res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcdedf] to-[#fce2e4] relative flex items-center justify-center font-serif overflow-hidden">
      {/* Soft background logo */}
      <img
        src={Logo}
        alt="Tangle background logo"
        className="absolute opacity-10 w-[600px] h-[600px] object-contain top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 w-full max-w-md text-center border border-rose-100 z-10">
        <h2 className="text-2xl font-bold text-[#4c1d95] mb-4">Create a Profile</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-xl text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl text-gray-800 border border-gray-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl text-gray-800 border border-gray-300"
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            required
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 rounded-xl text-gray-800 border border-gray-300"
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-xl text-gray-800 border border-gray-300"
          />

          {/* Relationship Intent Toggle */}
          <div className="flex justify-center gap-3 mb-2">
            {['Casual', 'Undecided', 'Serious'].map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => handleIntentClick(option)}
                className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                  formData.intent === option
                    ? 'bg-[#f472b6] text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ec4899] hover:bg-[#db2777] text-white py-3 rounded-xl font-medium transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
