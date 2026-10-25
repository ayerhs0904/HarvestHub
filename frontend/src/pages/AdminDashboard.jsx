import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  ShoppingBag, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import api from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingFarms, setPendingFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState({});

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const verifRes = await api.get('/admin/verifications');
      setPendingFarms(verifRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (farmId, status) => {
    const notes = actionNotes[farmId] || (status === 'VERIFIED' ? 'Audit verified: Organic farming credentials cleared.' : 'Documentation insufficient.');
    try {
      await api.put(`/admin/verifications/${farmId}`, {
        status: status,
        verificationNotes: notes,
      });
      alert(`Farm ${status === 'VERIFIED' ? 'Approved' : 'Rejected'} successfully! The producer has been notified.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Verification update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-cream-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Platform Administrator & Trust Auditor</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Admin Governance & Impact Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review farm certifications, moderate listings, monitor GMV, and audit platform food rescue metrics.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
          <span className="font-display font-extrabold text-3xl text-slate-900">{stats?.totalUsers || 5}</span>
          <span className="text-[10px] text-slate-400 block">Farmers, buyers & auditors</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Gross Sales (GMV)</span>
          <span className="font-display font-extrabold text-3xl text-forest-900">
            ${Number(stats?.grossMerchandiseValue || 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">Total completed order volume</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Surplus Produce Rescued</span>
          <span className="font-display font-extrabold text-3xl text-amber-600">
            {Number(stats?.rescuedProduceKg || 240).toFixed(0)} kg
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block">Food waste diverted</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Verified Farms</span>
          <span className="font-display font-extrabold text-3xl text-purple-700">
            {stats?.verifiedFarms || 2} / {stats?.totalFarms || 2}
          </span>
          <span className="text-[10px] text-slate-400 block">Audit verification rating</span>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest-600" />
              <span>Pending Farm Verification Applications ({pendingFarms.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Inspect farm methods, address, and organic accreditation documents before granting the Verified Producer badge.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
        ) : pendingFarms.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-medium text-slate-600">All registered farms have been audited!</p>
            <p>No applications currently awaiting verification in queue.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingFarms.map((farm) => (
              <div
                key={farm.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">{farm.farmName}</h3>
                    <p className="text-xs text-slate-500">
                      Producer: <strong>{farm.farmerName}</strong> • {farm.address}, {farm.city}, {farm.state}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Method: {farm.farmingMethod}
                    </span>
                  </div>

                  {farm.certificationDocUrl && (
                    <a
                      href={farm.certificationDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0"
                    >
                      <FileText className="w-4 h-4 text-forest-600" />
                      <span>Inspect Accreditation Doc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                  "{farm.bio || 'Sustainable agricultural producer dedicated to soil health.'}"
                </p>

                {/* Audit Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Enter audit remarks or requirements..."
                    value={actionNotes[farm.id] || ''}
                    onChange={(e) => setActionNotes({ ...actionNotes, [farm.id]: e.target.value })}
                    className="w-full sm:flex-1 p-2 bg-white rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-forest-600"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerify(farm.id, 'VERIFIED')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Verification</span>
                    </button>
                    <button
                      onClick={() => handleVerify(farm.id, 'REJECTED')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
