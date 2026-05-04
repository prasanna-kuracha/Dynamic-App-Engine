'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Cpu } from 'lucide-react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth` : 'http://localhost:5002/api/auth';

export const LoginView: React.FC<{ appName: string }> = ({ appName }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isRegister ? '/register' : '/login';
    const body = isRegister ? { email, password, name } : { email, password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#FDFCFE] to-[#F5F3FF] dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg dark:bg-gray-800 p-10 rounded-[2rem] shadow-2xl shadow-indigo-200/50 border border-white">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-indigo-900 dark:text-white tracking-tight">
            {appName}
          </h2>
          <p className="mt-2 text-xs font-bold text-indigo-400 tracking-wide">
            {isRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}
          </p>
        </div>
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold animate-pulse">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {isRegister && (
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full h-12 px-5 rounded-2xl border-2 border-indigo-50 bg-indigo-50/30 text-sm text-gray-800 placeholder-indigo-300 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            )}
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full h-12 px-5 rounded-2xl border-2 border-indigo-50 bg-indigo-50/30 text-sm text-gray-800 placeholder-indigo-300 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full h-12 px-5 rounded-2xl border-2 border-indigo-50 bg-indigo-50/30 text-sm text-gray-800 placeholder-indigo-300 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isRegister ? 'JOIN NOW' : 'SIGN IN'}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
