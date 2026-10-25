import React, { useState } from 'react';
import { Sparkles, HelpCircle, X, ShieldAlert, Clock, Sprout } from 'lucide-react';

export default function FreshnessBadge({ batch }) {
  const [showModal, setShowModal] = useState(false);

  if (!batch) return null;

  const pct = batch.freshnessPercentage ?? 95;
  const label = batch.freshnessLabel || 'Peak Freshness';
  const explanation = batch.freshnessExplanation || '';

  // Determine badge color gradient based on percentage
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let dotColor = 'bg-emerald-500';
  let progressColor = 'bg-emerald-500';

  if (pct >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
    progressColor = 'bg-emerald-500';
  } else if (pct >= 50) {
    badgeColor = 'bg-lime-50 text-lime-800 border-lime-200';
    dotColor = 'bg-lime-500';
    progressColor = 'bg-lime-500';
  } else if (pct >= 25) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
    progressColor = 'bg-amber-500';
  } else {
    badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
    dotColor = 'bg-orange-500';
    progressColor = 'bg-orange-500';
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}
        >
          <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`}></span>
          <span>{pct}% Fresh</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="truncate max-w-[140px]">{label.split('(')[0]}</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="text-slate-400 hover:text-forest-600 transition-colors"
          title="Explain this freshness calculation"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Freshness Explanation Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-elevated border border-slate-100 text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Explainable Freshness Indicator</h3>
                <span className="text-xs text-slate-500">Batch {batch.batchNumber}</span>
              </div>
            </div>

            {/* Progress Visualizer */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-600">Calculated Freshness Index</span>
                <span className="text-emerald-700 font-bold text-sm">{pct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${progressColor} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Harvest Day (100%)</span>
                <span>Optimal Window ({batch.freshnessWindowDays || 7} days)</span>
              </div>
            </div>

            {/* Breakdown Points */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-600 mb-5">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Harvest Date: </span>
                  {batch.harvestDate} ({batch.daysSinceHarvest || 0} days elapsed).
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sprout className="w-4 h-4 text-forest-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Storage Conditioning: </span>
                  {batch.storageCondition || 'Climate controlled cold-chain'}.
                </div>
              </div>
              <div className="p-3 bg-cream-100 rounded-xl border border-cream-300/60 text-slate-700">
                <div className="font-semibold text-forest-900 mb-1">Agronomic Formula:</div>
                {explanation || `Freshness decay model combines crop respiration rate with post-harvest timeline.`}
              </div>
            </div>

            {/* Mandatory Food-Safety Disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-normal">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> This indicator is an agricultural quality estimate designed to encourage eating fresh and reduce food waste. It does not replace sensory evaluation or local health and food-safety standards.
              </span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-bold text-sm transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
