import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, ShoppingBag, ArrowRight, Check, HeartHandshake, Leaf } from 'lucide-react';
import api from '../api/client';
import CountdownTimer from '../components/CountdownTimer';
import { useCart } from '../context/CartContext';

export default function SurplusRescue() {
  const [deals, setDeals] = useState([]);
  const [impact, setImpact] = useState({ totalRescuedKg: 0, co2EquivalentSavedKg: 0 });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedDealId, setAddedDealId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dealsRes = await api.get('/surplus/deals');
        setDeals(dealsRes.data || []);

        const impactRes = await api.get('/surplus/impact');
        setImpact(impactRes.data || { totalRescuedKg: 0, co2EquivalentSavedKg: 0 });
      } catch (err) {
        console.error('Error loading surplus deals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRescueItem = (deal) => {
    const mockProduce = {
      id: deal.produceListingId,
      farmId: 1, // fallback
      farmName: deal.farmName,
      title: deal.listingTitle,
      cropVariety: deal.cropVariety,
      imageUrl: deal.imageUrl,
      unit: deal.unit,
      basePricePerUnit: deal.regularPrice,
    };

    const mockBatch = {
      id: deal.harvestBatchId,
      batchNumber: deal.batchNumber,
      availableQuantity: deal.remainingQuantity,
    };

    addToCart(mockProduce, mockBatch, 1, true, deal.discountedPrice);
    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner with Waste Reduction Metrics */}
      <div className="bg-gradient-to-r from-amber-600 via-earth-600 to-amber-700 text-white rounded-3xl p-8 sm:p-12 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Zero Agricultural Food Spoilage Initiative</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Rescue Fresh Produce Before Cutoff. Save Up to 40%.
          </h1>

          <p className="text-sm sm:text-base text-amber-100 leading-relaxed max-w-2xl">
            When farms produce bumper yields or reach harvest capacity, produce is marked down for immediate community rescue. Fresh, delicious, and directly prevents food waste.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6">
            <div className="bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold font-display text-white">
                {Number(impact.totalRescuedKg || 240).toFixed(0)} kg
              </div>
              <div className="text-xs text-amber-200">Total Farm Produce Rescued</div>
            </div>
            <div className="bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold font-display text-emerald-300">
                {Number(impact.co2EquivalentSavedKg || 600).toFixed(0)} kg
              </div>
              <div className="text-xs text-amber-200">CO2 Equivalent Prevented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Active Surplus Flash Deals ({deals.length})
            </h2>
            <p className="text-xs text-slate-500">
              Quantities and discount windows update in real-time as community orders are fulfilled.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
            <Leaf className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-800">No Active Surplus Deals Right Now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All harvest surplus batches have been successfully rescued! Check back later or browse standard marketplace listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const remainingPct = Math.round((deal.remainingQuantity / deal.surplusQuantity) * 100);

              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-shadow"
                >
                  <div>
                    {/* Image & Discount Ribbon */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={deal.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop'}
                        alt={deal.listingTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                        {deal.discountPercentage}% OFF
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <CountdownTimer targetDate={deal.dealDeadline} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-forest-700 block">
                          {deal.farmName}
                        </span>
                        <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">
                          {deal.listingTitle}
                        </h3>
                        <p className="text-xs text-slate-500 italic">Variety: {deal.cropVariety}</p>
                      </div>

                      {/* Pickup Window */}
                      <div className="p-3 bg-cream-100/70 rounded-2xl border border-cream-200/80 text-xs text-slate-700">
                        <span className="font-bold text-forest-900 block text-[11px]">Rescue Pickup Window:</span>
                        <span>{deal.pickupWindow}</span>
                      </div>

                      {/* Remaining Quantity Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Remaining to Rescue</span>
                          <span className="text-forest-800 font-bold">
                            {deal.remainingQuantity} / {deal.surplusQuantity} {deal.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${remainingPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart button */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                    <div>
                      <div className="text-xs text-slate-400 line-through">
                        ${Number(deal.regularPrice).toFixed(2)}
                      </div>
                      <div className="font-display font-extrabold text-xl text-amber-600">
                        ${Number(deal.discountedPrice).toFixed(2)}
                        <span className="text-xs font-normal text-slate-500 ml-1">/ {deal.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRescueItem(deal)}
                      disabled={deal.remainingQuantity <= 0}
                      className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                        addedDealId === deal.id
                          ? 'bg-emerald-600 text-white'
                          : deal.remainingQuantity <= 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
                      }`}
                    >
                      {addedDealId === deal.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Rescue 1 {deal.unit}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
