import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Clock, CheckCircle2, ArrowRight, X, PlusCircle, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';

export default function CommunityBuys() {
  const { isAuthenticated, isBuyer } = useAuth();
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pledge modal state
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);
  const [pledgeQty, setPledgeQty] = useState(2);
  const [pledging, setPledging] = useState(false);

  // Create pool modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [produceList, setProduceList] = useState([]);
  const [selectedProduceId, setSelectedProduceId] = useState('');
  const [targetQuantity, setTargetQuantity] = useState(30);
  const [minPledge, setMinPledge] = useState(2);
  const [regularPrice, setRegularPrice] = useState(5.0);
  const [discountedPrice, setDiscountedPrice] = useState(3.8);
  const [deadlineDays, setDeadlineDays] = useState(5);
  const [pickupLocation, setPickupLocation] = useState('Central Community Hub');
  const [creating, setCreating] = useState(false);

  const fetchGroupBuys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/group-buys');
      setGroupBuys(res.data || []);
    } catch (err) {
      console.error('Error loading group buys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupBuys();
  }, []);

  const openCreateModal = async () => {
    try {
      const res = await api.get('/produce');
      const items = res.data?.content || [];
      setProduceList(items);
      if (items.length > 0) {
        setSelectedProduceId(String(items[0].id));
        setRegularPrice(Number(items[0].basePricePerUnit));
        setDiscountedPrice(Number((items[0].basePricePerUnit * 0.75).toFixed(2)));
      }
      setCreateModalOpen(true);
    } catch (err) {
      alert('Failed to load produce items: ' + err.message);
    }
  };

  const handlePledge = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to participate in community group buys.');
      return;
    }
    setPledging(true);
    try {
      await api.post(`/group-buys/${selectedGroupBuy.id}/join`, {
        pledgedQuantity: pledgeQty,
      });
      alert('Pledge placed successfully! Thank you for backing this community bulk pool.');
      setPledgeModalOpen(false);
      fetchGroupBuys();
    } catch (err) {
      alert(err.message || 'Failed to place pledge.');
    } finally {
      setPledging(false);
    }
  };

  const handleCreatePool = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

      await api.post('/group-buys', {
        produceListingId: Number(selectedProduceId),
        targetQuantity: Number(targetQuantity),
        minPledgePerBuyer: Number(minPledge),
        regularPrice: Number(regularPrice),
        discountedPrice: Number(discountedPrice),
        deadline: deadlineDate.toISOString(),
        pickupLocation: pickupLocation,
      });

      alert('Community group buy pool successfully launched!');
      setCreateModalOpen(false);
      fetchGroupBuys();
    } catch (err) {
      alert(err.message || 'Failed to create group buy pool.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-forest-700 to-forest-800 text-white rounded-3xl p-8 sm:p-12 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Crowdsourced Agricultural Wholesale</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
            Community Group Buying Pools
          </h1>

          <p className="text-sm text-forest-100 leading-relaxed">
            Team up with neighbors and local households to reach harvest volume thresholds. When the pool target is reached, everyone unlocks 20-30% bulk wholesale discounts.
          </p>
        </div>

        {isAuthenticated && isBuyer && (
          <button
            onClick={openCreateModal}
            className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-display font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Launch Group Pool</span>
          </button>
        )}
      </div>

      {/* Group Buys Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Active Community Campaigns ({groupBuys.length})
            </h2>
            <p className="text-xs text-slate-500">
              Pledge quantities to progress toward the discounted wholesale threshold.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : groupBuys.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
            <Users className="w-10 h-10 text-teal-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-800">No Active Group Buys</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first organizer to launch a community group buy pool for your neighborhood!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupBuys.map((gb) => (
              <div
                key={gb.id}
                className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-shadow"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={gb.imageUrl || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop'}
                      alt={gb.produceTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-teal-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                      {gb.progressPercentage}% Pooled
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <CountdownTimer targetDate={gb.deadline} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] text-slate-400">Organized by {gb.organizerName}</span>
                      <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">
                        {gb.produceTitle}
                      </h3>
                      <p className="text-xs text-slate-500 italic">Variety: {gb.cropVariety}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Pooled Volume</span>
                        <span className="font-bold text-forest-800">
                          {gb.currentQuantity} / {gb.targetQuantity} {gb.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, gb.progressPercentage)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{gb.participantCount} backers</span>
                        <span>Min pledge: {gb.minPledgePerBuyer} {gb.unit}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-cream-100 rounded-2xl text-[11px] text-slate-600 space-y-0.5">
                      <div className="font-semibold text-forest-900">Pickup Hub: {gb.pickupLocation}</div>
                      <div>Status: <strong>{gb.status?.replace('_', ' ')}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Price & Join button */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                  <div>
                    <div className="text-xs text-slate-400 line-through">
                      ${Number(gb.regularPrice).toFixed(2)}
                    </div>
                    <div className="font-display font-extrabold text-xl text-teal-700">
                      ${Number(gb.discountedPrice).toFixed(2)}
                      <span className="text-xs font-normal text-slate-500 ml-1">/ {gb.unit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGroupBuy(gb);
                      setPledgeQty(gb.minPledgePerBuyer || 2);
                      setPledgeModalOpen(true);
                    }}
                    disabled={gb.status !== 'OPEN'}
                    className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      gb.status !== 'OPEN'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span>{gb.status === 'TARGET_MET' ? 'Target Met!' : 'Pledge Quantity'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pledge Quantity Modal */}
      {pledgeModalOpen && selectedGroupBuy && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setPledgeModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPledgeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
              Pledge to Community Pool
            </h3>
            <p className="text-xs text-slate-500 mb-5">{selectedGroupBuy.produceTitle}</p>

            <form onSubmit={handlePledge} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Quantity ({selectedGroupBuy.unit})
                </label>
                <input
                  type="number"
                  min={selectedGroupBuy.minPledgePerBuyer}
                  value={pledgeQty}
                  onChange={(e) => setPledgeQty(Number(e.target.value))}
                  className="w-full p-3 bg-cream-50 rounded-xl text-base font-bold text-slate-900 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Minimum pledge: {selectedGroupBuy.minPledgePerBuyer} {selectedGroupBuy.unit}
                </span>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-900 flex justify-between items-center">
                <span>Pledged Total:</span>
                <span className="font-bold text-base">
                  ${(pledgeQty * selectedGroupBuy.discountedPrice).toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={pledging}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md disabled:opacity-50"
              >
                {pledging ? 'Submitting Pledge...' : 'Confirm Pledge'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launch Group Buy Pool Modal */}
      {createModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setCreateModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-elevated text-slate-800 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
              Launch a New Community Group Buy
            </h3>
            <p className="text-xs text-slate-500 mb-5">Pool collective volume to unlock producer bulk pricing.</p>

            <form onSubmit={handleCreatePool} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Select Produce Item
                </label>
                <select
                  value={selectedProduceId}
                  onChange={(e) => {
                    setSelectedProduceId(e.target.value);
                    const sel = produceList.find(p => String(p.id) === e.target.value);
                    if (sel) {
                      setRegularPrice(Number(sel.basePricePerUnit));
                      setDiscountedPrice(Number((sel.basePricePerUnit * 0.75).toFixed(2)));
                    }
                  }}
                  className="w-full p-3 bg-cream-50 rounded-xl font-medium border border-cream-300"
                >
                  {produceList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.farmName}) - ${p.basePricePerUnit}/{p.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Target Volume
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Min Pledge / Buyer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minPledge}
                    onChange={(e) => setMinPledge(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold border border-cream-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Regular Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Discounted Bulk Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold text-teal-800 border border-cream-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Deadline (Days from now)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Pickup Hub Address
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md mt-2 disabled:opacity-50"
              >
                {creating ? 'Launching...' : 'Publish Group Buy Pool'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
