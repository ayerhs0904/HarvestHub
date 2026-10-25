import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_FARMER') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-cream-200 shadow-elevated overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Artwork & Value Prop */}
        <div className="bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-white p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Welcome back to Harvest Hub
            </h2>
            <p className="text-xs sm:text-sm text-forest-100 leading-relaxed font-normal">
              Connecting local farmers directly with consumers. Trace harvest origins, reserve upcoming crops, and rescue surplus produce.
            </p>
          </div>

          {/* Quick Fill Demo Badges */}
          <div className="pt-8 space-y-2 border-t border-forest-600/60 mt-6">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Accounts</span>
            </span>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('buyer.shreya@harvesthub.farm', 'password123')}
                className="p-2 rounded-xl bg-forest-900/50 hover:bg-forest-900 text-left border border-forest-600/80 transition-colors"
              >
                <div className="font-bold text-white">Shreya Sen (Buyer)</div>
                <div className="text-[10px] text-forest-200">buyer.shreya@harvesthub.farm</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('farmer.green@harvesthub.farm', 'password123')}
                className="p-2 rounded-xl bg-forest-900/50 hover:bg-forest-900 text-left border border-forest-600/80 transition-colors"
              >
                <div className="font-bold text-white">Rajesh Patel (Farmer)</div>
                <div className="text-[10px] text-forest-200">farmer.green@harvesthub.farm</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@harvesthub.farm', 'password123')}
                className="p-2 rounded-xl bg-forest-900/50 hover:bg-forest-900 text-left border border-forest-600/80 transition-colors"
              >
                <div className="font-bold text-white">Platform Admin (Auditor)</div>
                <div className="text-[10px] text-forest-200">admin@harvesthub.farm</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900">Sign In</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl font-medium border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl font-medium border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
