import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  FileCheck2,
  Sprout,
  Sun,
  Scissors,
  PackageCheck,
  Truck
} from 'lucide-react';

const STAGE_CONFIG = {
  SEEDING: { label: 'Seed Selection & Sowing', icon: Sprout, color: 'text-emerald-600 bg-emerald-100' },
  CULTIVATION: { label: 'Organic Cultivation & Care', icon: Sun, color: 'text-amber-600 bg-amber-100' },
  HARVEST: { label: 'Harvest at Peak Ripeness', icon: Scissors, color: 'text-forest-600 bg-forest-100' },
  QUALITY_INSPECTION: { label: 'Quality & Brix Inspection', icon: FileCheck2, color: 'text-purple-600 bg-purple-100' },
  PACKAGING: { label: 'Sustainable Packing & QR Label', icon: PackageCheck, color: 'text-blue-600 bg-blue-100' },
  DISPATCH_TO_HUB: { label: 'Cold-Chain Dispatch', icon: Truck, color: 'text-teal-600 bg-teal-100' },
};

export default function TraceabilityTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No lifecycle events logged for this batch yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-forest-500 before:to-slate-200">
      {events.map((event, index) => {
        const config = STAGE_CONFIG[event.stage] || { label: event.stage, icon: CheckCircle2, color: 'text-slate-600 bg-slate-100' };
        const IconComponent = config.icon;
        const eventDate = new Date(event.eventTimestamp).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        return (
          <div key={event.id || index} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-[31px] top-0 w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center ${config.color}`}>
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Event Content Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-display font-bold text-base text-slate-900">
                  {config.label}
                </span>

                {/* Verification Badge */}
                {event.verifiedByAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Admin Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Farmer Logged
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {event.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-forest-600" />
                  {eventDate}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {event.location}
                </span>
                {event.operatorName && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Operator: {event.operatorName}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
