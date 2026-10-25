import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  X,
  MessageSquare
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DemandBoard() {
  const { user, isAuthenticated, isBuyer, isFarmer } = useAuth();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post demand request modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [cropName, setCropName] = useState('');
  const [requestedQty, setRequestedQty] = useState(25);
  const [unit, setUnit] = useState('KG');
  const [neededByDate, setNeededByDate] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingDemand, setSubmittingDemand] = useState(false);

  // Farmer submit offer modal
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [offerNotes, setOfferNotes] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/demand-board');
      setDemands(res.data || []);
    } catch (err) {
      console.error('Error fetching demand posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const handlePostDemand = async (e) => {
    e.preventDefault();
    setSubmittingDemand(true);
    try {
      await api.post('/demand-board', {
        cropName,
        requestedQuantity: Number(requestedQty),
        unit,
        neededByDate,
        maxBudgetPerUnit: maxBudget ? Number(maxBudget) : null,
        deliveryLocation: location,
        notes,
      });
      alert('Crop demand request published successfully! Local farmers will be alerted.');
      setPostModalOpen(false);
      setCropName('');
      setNotes('');
      fetchDemands();
    } catch (err) {
      alert(err.message || 'Failed to post demand.');
    } finally {
      setSubmittingDemand(false);
    }
  };

  const handlePostOffer = async (e) => {
    e.preventDefault();
    setSubmittingOffer(true);
    try {
      await api.post(`/demand-board/${selectedDemand.id}/offers`, {
        offeredPricePerUnit: Number(offeredPrice),
        availableDate,
        notes: offerNotes,
      });
      alert('Your quote has been submitted to the buyer!');
      setOfferModalOpen(false);
      fetchDemands();
    } catch (err) {
      alert(err.message || 'Failed to submit offer.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Accept this farmer proposal? This will lock in the transaction agreement.')) return;
    try {
      await api.put(`/demand-board/offers/${offerId}/accept`);
      alert('Offer accepted! You can now coordinate harvest pickup or local delivery with the farmer.');
      fetchDemands();
    } catch (err) {
      alert(err.message || 'Failed to accept offer.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white rounded-3xl p-8 sm:p-12 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <ClipboardList className="w-4 h-4" />
            <span>Demand-Driven Agricultural Marketplace</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
            Crop Demand & Bidding Board
          </h1>

          <p className="text-sm text-forest-100 leading-relaxed">
            Restaurants, caterers, and households can broadcast custom produce needs (e.g. "30 kg Heirloom Tomatoes needed next Friday"). Local producers bid competitive price quotes directly.
          </p>
        </div>

        {isAuthenticated && isBuyer && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-display font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post Crop Request (RFQ)</span>
          </button>
        )}
      </div>

      {/* Demands List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Active Buyer Demand Posts ({demands.length})
            </h2>
            <p className="text-xs text-slate-500">
              Inspect buyer requirements and submit direct farm quotes.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : demands.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
            <ClipboardList className="w-10 h-10 text-forest-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-800">No Crop Demands Posted</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Restaurants and buyers haven't posted special requests yet. Create the first demand request!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {demands.map((demand) => {
              const isOwner = user && user.id === demand.buyerId;

              return (
                <div
                  key={demand.id}
                  className="bg-white rounded-3xl border border-cream-200 shadow-soft p-6 sm:p-8 space-y-5"
                >
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-xl text-slate-900">
                          {demand.cropName}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          demand.status === 'FULFILLED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : demand.status === 'OFFERS_RECEIVED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {demand.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Posted by {demand.buyerName}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="p-2 rounded-xl bg-forest-50 text-forest-800">
                        Needed: <strong>{demand.requestedQuantity} {demand.unit}</strong>
                      </span>
                      <span className="p-2 rounded-xl bg-cream-100 text-slate-700">
                        Needed by: <strong>{demand.neededByDate}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Notes & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                    <div className="md:col-span-2">
                      <span className="font-bold text-slate-800 block mb-1">Buyer Notes & Requirements:</span>
                      <p className="italic bg-cream-50 p-3 rounded-2xl border border-cream-200">
                        "{demand.notes || 'No specific cultivar or shape requirements provided.'}"
                      </p>
                    </div>

                    <div className="space-y-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{demand.deliveryLocation || 'Local pickup/delivery'}</span>
                      </div>
                      {demand.maxBudgetPerUnit && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <span>Max Budget: ${Number(demand.maxBudgetPerUnit).toFixed(2)} / {demand.unit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offers List */}
                  {demand.offers && demand.offers.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Farmer Price Quotes & Proposals ({demand.offers.length})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {demand.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                              offer.status === 'ACCEPTED'
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-white border-cream-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{offer.farmName}</span>
                                </span>
                                <span className="font-display font-bold text-base text-forest-800">
                                  ${Number(offer.offeredPricePerUnit).toFixed(2)} / {demand.unit}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 italic">"{offer.notes}"</p>
                              <div className="text-[10px] text-slate-400">Available Date: {offer.availableDate}</div>
                            </div>

                            {/* Accept Button for Demand Creator */}
                            {isOwner && offer.status !== 'ACCEPTED' && demand.status !== 'FULFILLED' && (
                              <button
                                onClick={() => handleAcceptOffer(offer.id)}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                              >
                                Accept Farmer Offer
                              </button>
                            )}

                            {offer.status === 'ACCEPTED' && (
                              <div className="text-center py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Accepted Proposal</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Farmer Bid CTA */}
                  {isAuthenticated && isFarmer && demand.status !== 'FULFILLED' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedDemand(demand);
                          setOfferedPrice(demand.maxBudgetPerUnit ? String(demand.maxBudgetPerUnit) : '2.50');
                          setAvailableDate(demand.neededByDate);
                          setOfferModalOpen(true);
                        }}
                        className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Submit Farm Price Quote</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Demand Request Modal */}
      {postModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setPostModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-elevated text-slate-800 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPostModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
              Post Crop Demand Request
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Broadcast your restaurant or household crop needs to certified regional farmers.
            </p>

            <form onSubmit={handlePostDemand} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Crop Name & Desired Variety
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Marzano Plum Tomatoes"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-3 bg-cream-50 rounded-xl font-medium border border-cream-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Requested Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Measurement Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold border border-cream-300"
                  >
                    <option value="KG">KG</option>
                    <option value="CRATE">CRATE</option>
                    <option value="BUNCH">BUNCH</option>
                    <option value="DOZEN">DOZEN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Needed by Date
                  </label>
                  <input
                    type="date"
                    required
                    value={neededByDate}
                    onChange={(e) => setNeededByDate(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Max Target Budget ($)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    placeholder="Optional budget ceiling"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bistro Central Kitchen, 12 Culinary Avenue"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Specific Cultivar & Quality Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. High Brix sugar score required; uniform size preferred for catering presentation."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingDemand}
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md mt-2 disabled:opacity-50"
              >
                {submittingDemand ? 'Publishing Request...' : 'Publish Crop Demand Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submit Farmer Offer Modal */}
      {offerModalOpen && selectedDemand && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setOfferModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOfferModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
              Submit Farmer Price Quote
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Quoting for {selectedDemand.requestedQuantity} {selectedDemand.unit} of {selectedDemand.cropName}
            </p>

            <form onSubmit={handlePostOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Offered Price ($ / {selectedDemand.unit})
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="w-full p-3 bg-cream-50 rounded-xl font-bold text-base text-forest-800 border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Guaranteed Harvest / Availability Date
                </label>
                <input
                  type="date"
                  required
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Message to Buyer / Delivery Commitment
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Can pick fresh at sunrise from Greenhouse #1 and deliver directly to your kitchen."
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingOffer}
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md disabled:opacity-50"
              >
                {submittingOffer ? 'Submitting Quote...' : 'Send Quote to Buyer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
