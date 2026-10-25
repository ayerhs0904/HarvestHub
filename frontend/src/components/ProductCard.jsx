import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ShoppingBag, Check, ShieldCheck, Star } from 'lucide-react';
import FreshnessBadge from './FreshnessBadge';
import { useCart } from '../context/CartContext';

export default function ProductCard({ produce }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Pick active batch (first active batch)
  const activeBatch = produce.batches?.find(b => b.status === 'ACTIVE') || produce.batches?.[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeBatch) {
      alert('This listing is currently awaiting harvest.');
      return;
    }
    addToCart(produce, activeBatch, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="farm-card bg-white rounded-3xl overflow-hidden border border-cream-200/80 shadow-soft flex flex-col group">
      {/* Image & Quick Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={produce.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'}
          alt={produce.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Farming Method Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-forest-800/85 text-emerald-300 backdrop-blur-md border border-emerald-400/20">
            {produce.farmingMethod?.replace('_', ' ') || 'ORGANIC'}
          </span>
        </div>

        {/* Traceability Passport Icon Button */}
        {activeBatch && (
          <Link
            to={`/traceability/${activeBatch.batchNumber}`}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-forest-800 shadow-md backdrop-blur-md hover:scale-110 transition-all"
            title="Inspect QR Traceability Passport"
            onClick={(e) => e.stopPropagation()}
          >
            <QrCode className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Farm origin */}
          <div className="flex items-center justify-between gap-1 text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium text-forest-700 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{produce.farmName}</span>
            </span>
            <span className="shrink-0 flex items-center gap-0.5 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {produce.averageRating || '5.0'}
            </span>
          </div>

          {/* Title & Variety */}
          <Link to={`/produce/${produce.id}`} className="block group-hover:text-forest-600 transition-colors">
            <h3 className="font-display font-bold text-base text-slate-900 leading-snug line-clamp-1">
              {produce.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 italic mt-0.5 mb-3 line-clamp-1">
            Variety: {produce.cropVariety}
          </p>

          {/* Explainable Freshness Badge */}
          {activeBatch && (
            <div className="mb-4">
              <FreshnessBadge batch={activeBatch} />
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-xs text-slate-400 font-medium">Price per {produce.unit}</div>
            <div className="font-display font-extrabold text-lg text-forest-900">
              ${Number(produce.basePricePerUnit).toFixed(2)}
              <span className="text-xs font-normal text-slate-500 ml-1">/ {produce.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/produce/${produce.id}`}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 transition-colors"
            >
              Details
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={!activeBatch || activeBatch.availableQuantity <= 0}
              className={`p-2.5 rounded-xl font-bold transition-all shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : !activeBatch || activeBatch.availableQuantity <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-forest-600 hover:bg-forest-700 text-white hover:scale-105 active:scale-95'
              }`}
              title="Add 1 to Basket"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
