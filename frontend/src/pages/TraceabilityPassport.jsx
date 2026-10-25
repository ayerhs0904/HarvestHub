import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  Printer, 
  Share2, 
  ArrowLeft,
  Info
} from 'lucide-react';
import api from '../api/client';
import TraceabilityTimeline from '../components/TraceabilityTimeline';

export default function TraceabilityPassport() {
  const { batchNumber } = useParams();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPassport = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/traceability/${batchNumber}`);
        setPassport(res.data);
      } catch (err) {
        console.error('Error fetching passport:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [batchNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-800">Passport Not Found</h2>
        <p className="text-xs text-slate-500">The requested harvest batch could not be found or has not been registered.</p>
        <Link to="/marketplace" className="inline-flex px-5 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-bold">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-forest-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-cream-300 text-slate-700 hover:bg-cream-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-forest-600 text-white hover:bg-forest-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Label</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white rounded-3xl p-8 sm:p-10 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifiable Harvest-to-Home Digital Passport</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
              {passport.produceTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-forest-100">
              <span className="font-mono bg-forest-900/60 px-2.5 py-1 rounded-md border border-forest-600">
                Batch: {passport.batchNumber}
              </span>
              <span>Variety: {passport.cropVariety}</span>
              <span>Farm: {passport.farmName} ({passport.farmCity})</span>
            </div>
          </div>

          {/* Interactive QR Code Card */}
          <div className="bg-white p-4 rounded-2xl shadow-elevated text-center shrink-0 self-center md:self-auto">
            <QRCodeSVG
              value={passport.qrCodeContent || window.location.href}
              size={130}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
            <span className="block text-[10px] font-mono font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Scan to Verify
            </span>
          </div>
        </div>
      </div>

      {/* Audit Stats & Freshness Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Status */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Administrative Verification
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-slate-900">
                {passport.farmVerificationStatus === 'VERIFIED' ? 'Certified Verified Farm' : 'Pending Verification'}
              </div>
              <div className="text-xs text-slate-500">{passport.farmingMethod?.replace('_', ' ')} Standards</div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100">
            <span>Admin-Audited Steps:</span>
            <span className="font-bold text-emerald-700">{passport.adminVerifiedStepsCount}</span>
          </div>
        </div>

        {/* Harvest Date & Storage */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Harvest Timing & Storage
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-slate-900">
                Harvested: {passport.harvestDate}
              </div>
              <div className="text-xs text-slate-500">{passport.storageCondition || 'Optimal cool storage'}</div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100">
            <span>Producer-Logged Steps:</span>
            <span className="font-bold text-slate-700">{passport.farmerLoggedStepsCount}</span>
          </div>
        </div>

        {/* Explainable Freshness Score */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Freshness Index
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-slate-900">
                {passport.freshnessPercentage}% Quality Score
              </div>
              <div className="text-xs text-slate-500">{passport.freshnessLabel}</div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 truncate border-t border-slate-100">
            Agronomic calculation based on harvest date
          </div>
        </div>
      </div>

      {/* Freshness Disclaimer Alert */}
      <div className="p-4 bg-cream-100/80 rounded-2xl border border-cream-300 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-forest-900">Agricultural Explanation: </span>
          {passport.freshnessExplanation}
        </div>
      </div>

      {/* Batch Journey Timeline */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-soft space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Batch Lifecycle & Quality Milestones
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit trail from initial seed sowing to packing and dispatch.
          </p>
        </div>

        <TraceabilityTimeline events={passport.events} />
      </div>
    </div>
  );
}
