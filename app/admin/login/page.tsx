'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push('/admin');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-200/50 to-transparent pointer-events-none -skew-x-12 transform origin-top translate-x-1/4"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-2xl rounded-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl tracking-widest text-[#111] mb-2">ANFAAL</h1>
          <p className="font-body text-gray-500 text-sm">Sign in to workspace dashboard</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-4 mb-6 font-body text-sm flex items-start animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="font-body text-sm font-medium text-gray-700 block">Username or Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="admin" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="font-body text-sm font-medium text-gray-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-body font-medium transition-colors flex items-center justify-center relative overflow-hidden"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
