import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFEFEF] to-[#FADCD9] flex items-center justify-center">
      <div className="bg-white/50 backdrop-blur-xl border border-rose-100 shadow-lg rounded-3xl px-8 py-12 w-full max-w-sm text-center">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Welcome to</h1>
        <h2 className="text-5xl font-serif font-extrabold text-rose-500 mb-6">Tangle</h2>
        <p className="text-gray-700 font-light text-lg mb-12 font-sans">
          Every story <br /> deserves a match.
        </p>
        <Link
          to="/register"
          className="inline-block bg-rose-400 text-white text-lg font-medium px-6 py-3 rounded-full shadow hover:bg-rose-500 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
