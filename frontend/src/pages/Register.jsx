import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_BUYER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await register({
        fullName,
        email,
        password,
        phone,
        address,
        role,
      });

      if (user.role === 'ROLE_FARMER') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-cream-200 shadow-elevated p-8 sm:p-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Join the Harvest Hub Network
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an account as a consumer or certified regional producer.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role selector toggle */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ROLE_BUYER')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  role === 'ROLE_BUYER'
                    ? 'border-forest-600 bg-forest-50 font-bold text-forest-900 ring-2 ring-forest-600/20'
                    : 'border-cream-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm">Buyer / Consumer</div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5">Shop, reserve & group buy</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('ROLE_FARMER')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  role === 'ROLE_FARMER'
                    ? 'border-forest-600 bg-forest-50 font-bold text-forest-900 ring-2 ring-forest-600/20'
                    : 'border-cream-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm">Agricultural Producer</div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5">List produce & batches directly</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-600 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-600 text-slate-900"
                />
              </div>
            </div>
          </div>

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
                className="w-full pl-10 pr-3 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-600 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
              Location / Delivery Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Street address or farmland location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-1 focus:ring-forest-600 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered on Harvest Hub?{' '}
          <Link to="/login" className="font-bold text-forest-700 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
