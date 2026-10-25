import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShieldCheck, 
  QrCode, 
  Flame, 
  ArrowRight, 
  CalendarClock, 
  Users, 
  Truck, 
  Leaf, 
  Sparkles,
  TrendingDown,
  Search
} from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProduce, setFeaturedProduce] = useState([]);
  const [surplusDeals, setSurplusDeals] = useState([]);
  const [impactStats, setImpactStats] = useState({ totalRescuedKg: 240, co2Saved: 600 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prodRes = await api.get('/produce?size=4');
        setFeaturedProduce(prodRes.data?.content || []);

        const surplusRes = await api.get('/surplus/deals');
        setSurplusDeals(surplusRes.data || []);

        const impactRes = await api.get('/surplus/impact');
        if (impactRes.data) {
          setImpactStats({
            totalRescuedKg: impactRes.data.totalRescuedKg || 240,
            co2Saved: impactRes.data.co2EquivalentSavedKg || 600,
          });
        }
      } catch (err) {
        console.warn('Home data load error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-800 via-forest-700 to-forest-800 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Organic texture background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#52b788_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-600/80 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Direct Agricultural Marketplace & Traceability Protocol</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] max-w-4xl mx-auto">
            From Local Soil to Your Table, with <span className="text-sage-300 underline decoration-emerald-500/60 decoration-wavy">Verifiable Truth</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-forest-100/90 leading-relaxed font-normal">
            Eliminate broker markups, inspect QR harvest batch passports, reserve upcoming crops before harvest, and rescue surplus farm produce at a discount.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/marketplace?search=${encodeURIComponent(searchQuery)}`;
              }}
              className="flex items-center bg-white p-2 rounded-2xl shadow-elevated border border-white/20"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search tomatoes, Ratnagiri Alphonso mangoes, organic basil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-800 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
              >
                Search Market
              </button>
            </form>
          </div>

          {/* Impact Stats Banner */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-600/60 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-emerald-400 font-display">100%</div>
              <div className="text-xs text-forest-200">QR Traceable Batches</div>
            </div>
            <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-600/60 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-amber-300 font-display">
                {Number(impactStats.totalRescuedKg).toFixed(0)} kg
              </div>
              <div className="text-xs text-forest-200">Surplus Food Rescued</div>
            </div>
            <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-600/60 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-sage-300 font-display">0 Middlemen</div>
              <div className="text-xs text-forest-200">Farmer-Direct Earnings</div>
            </div>
            <div className="p-4 rounded-2xl bg-forest-900/60 border border-forest-600/60 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-emerald-300 font-display">
                {Number(impactStats.co2Saved).toFixed(0)} kg
              </div>
              <div className="text-xs text-forest-200">CO2 Equivalent Diverted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Surplus Food Rescue Flash Spotlight */}
      {surplusDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-earth-600 text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Flame className="w-4 h-4 text-amber-200 animate-bounce" />
                <span>Zero Food Waste Initiative</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Fresh Farm Produce at Rescue Prices
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
                Farmers have marked ripe surplus produce for quick sale before scheduled harvest cutoffs. Up to 40% discount on peak organic harvests!
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                to="/surplus-rescue"
                className="px-6 py-3.5 bg-white text-amber-900 hover:bg-amber-50 font-display font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 group"
              >
                <span>Explore Rescue Deals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Seasonal Produce Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-forest-600 mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Direct Harvest Catalog</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">
              Seasonal Fresh Picks
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 hover:text-forest-900 transition-colors"
          >
            <span>View All Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProduce.map((prod) => (
              <ProductCard key={prod.id} produce={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Unique Innovations Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
            Innovative Agricultural Technologies
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
            Why Harvest Hub is Transforming Modern Farming
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Traceability Passport */}
          <div className="bg-white rounded-3xl p-8 border border-cream-300/80 shadow-soft space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Harvest-to-Home QR Passport
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every crop crate carries an immutable digital passport. Scan the QR code on the box to view soil care, harvest time, cold storage logs, and administrator audits.
            </p>
            <Link
              to="/traceability/BATCH-2026-TOM-01"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 hover:text-forest-800"
            >
              <span>View Sample QR Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2: Pre-Harvest Reservations */}
          <div className="bg-white rounded-3xl p-8 border border-cream-300/80 shadow-soft space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Pre-Harvest Reservation Market
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reserve premium harvests before they are picked. Farmers gain predictable revenue to plan picking operations, while buyers secure guaranteed peak freshness.
            </p>
            <Link
              to="/harvest-reservations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 hover:text-forest-800"
            >
              <span>Explore Upcoming Harvests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3: Community Group Buying */}
          <div className="bg-white rounded-3xl p-8 border border-cream-300/80 shadow-soft space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Community Bulk Purchasing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Join neighborhood wholesale pools. Unlock 20-30% volume discounts directly from regional producers when collective community orders meet harvest thresholds.
            </p>
            <Link
              to="/community-buys"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 hover:text-forest-800"
            >
              <span>Join Active Group Pools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Farm Direct Delivery & Pickup Process */}
      <section className="bg-cream-100/70 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
              How Harvest Hub Operates
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">
              Four Steps to Fresh Transparency
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-display font-bold text-slate-900">Harvest Logged</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Farmer enters batch date, crop variety, and storage conditions. The explainable freshness clock starts.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-display font-bold text-slate-900">Verified Inspection</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Administrators audit pesticide-free documentation and certify farm compliance credentials.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-display font-bold text-slate-900">Atomic Checkout</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pessimistic write locks guarantee zero overselling. Buyers pick delivery or farm pickup time slots.
              </p>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="font-display font-bold text-slate-900">Scan & Enjoy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan the batch QR code on your crate to view its complete journey, and leave a verified purchase review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
