import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Leaf, QrCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100 border-t border-forest-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-forest-800/80">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Harvest<span className="text-sage-300">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-forest-200/80 leading-relaxed">
              Empowering regional farmers with direct market access, guaranteed crop traceability, pre-harvest booking, and surplus food rescue.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Certified Direct Trade</span>
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-forest-200">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Seasonal Produce</Link></li>
              <li><Link to="/surplus-rescue" className="hover:text-amber-300 transition-colors">Surplus Food Rescue Deals</Link></li>
              <li><Link to="/harvest-reservations" className="hover:text-white transition-colors">Pre-Harvest Marketplace</Link></li>
              <li><Link to="/community-buys" className="hover:text-white transition-colors">Community Wholesale Pools</Link></li>
              <li><Link to="/demand-board" className="hover:text-white transition-colors">Crop Demand RFQ Board</Link></li>
            </ul>
          </div>

          {/* Agricultural Traceability */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Traceability & Transparency
            </h4>
            <ul className="space-y-2 text-xs text-forest-200">
              <li className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-sage-300" />
                <span>QR Batch Passports</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-sage-300" />
                <span>Zero Pesticide Audits</span>
              </li>
              <li><span className="text-forest-300/80">Admin Verification Queue</span></li>
              <li><span className="text-forest-300/80">Agronomic Freshness Modeling</span></li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Architecture & Stack
            </h4>
            <p className="text-xs text-forest-200/80 leading-relaxed mb-3">
              Engineered for reliability with Java 17, Spring Boot 3, Spring Security, JWT, JPA, PostgreSQL, React, and Tailwind CSS.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-medium text-emerald-300">
              <span className="px-2 py-0.5 rounded bg-forest-800 border border-forest-700">Spring Boot 3</span>
              <span className="px-2 py-0.5 rounded bg-forest-800 border border-forest-700">JWT RBAC</span>
              <span className="px-2 py-0.5 rounded bg-forest-800 border border-forest-700">PostgreSQL</span>
              <span className="px-2 py-0.5 rounded bg-forest-800 border border-forest-700">React + Vite</span>
              <span className="px-2 py-0.5 rounded bg-forest-800 border border-forest-700">Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-300/60">
          <div>
            &copy; {new Date().getFullYear()} Harvest Hub Platform. Designed for transparent agriculture and food rescue.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with care for farmers and consumers</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
