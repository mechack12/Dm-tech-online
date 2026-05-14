import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { User, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-bg-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-display tracking-tight mb-4">Welcome Back</h1>
          <p className="text-gray-500 font-medium tracking-tight">Access your Eclipse account.</p>
        </div>

        <Card className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-lg shadow-lg shadow-brand-primary/10 mt-4">
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-primary font-bold hover:underline">
                    Create Account
                </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Sample Credentials</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg text-left">
                <p className="text-[10px] font-bold text-brand-primary mb-1">ADMIN</p>
                <p className="text-xs font-medium text-gray-400">User: Mech</p>
                <p className="text-xs font-medium text-gray-400">Pass: 1234</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-left">
                <p className="text-[10px] font-bold text-accent-green mb-1">GUEST</p>
                <p className="text-xs font-medium text-gray-400">User: Lucky</p>
                <p className="text-xs font-medium text-gray-400">Pass: 12345</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
