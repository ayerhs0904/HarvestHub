import React, { useState, useEffect } from 'react';
import { CalendarClock, ShieldCheck, CheckCircle2, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function HarvestReservations() {
  const { isAuthenticated, isBuyer } = useAuth();
  const [upcomingBatches, setUpcomingBatches] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reservation modal state
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [reserveQty, setReserveQty] = useState(5);
  const [notes, setNotes] = useState('');
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchReservationsData = async () => {
    setLoading(true);
    try {
      const upcomingRes = await api.get('/reservations/upcoming');
      setUpcomingBatches(upcomingRes.data || []);

      if (isAuthenticated && isBuyer) {
        const myRes = await api.get('/reservations/my');
        setMyReservations(myRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationsData();
  }, [isAuthenticated, isBuyer]);

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in as a buyer to reserve upcoming harvests.');
      return;
    }
    setReserving(true);
    setMessage('');
    try {
      await api.post('/reservations', {
        harvestBatchId: selectedBatch.id,
        quantity: reserveQty,
        notes: notes,
      });
      setMessage('Reservation confirmed successfully! The farmer has received your advance booking.');
      setSelectedBatch(null);
      fetchReservationsData();
    } catch (err) {
      alert(err.message || 'Failed to place reservation.');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 text-white rounded-3xl p-8 sm:p-10 shadow-elevated">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <CalendarClock className="w-4 h-4" />
            <span>Forward Agricultural Contracts</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
            Pre-Harvest Reservation Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-forest-100 leading-relaxed">
            Reserve premium crops while they are still ripening on the vine. Farmers gain upfront demand visibility, and you secure guaranteed early allocation right after picking.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Buyer's Active Bookings (if logged in) */}
      {isAuthenticated && isBuyer && myReservations.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-600" />
            <span>My Active Pre-Harvest Bookings ({myReservations.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReservations.map((res) => (
              <div key={res.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{res.produceTitle}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    res.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {res.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Farm: {res.farmName} | Batch: {res.batchNumber}
                </div>
                <div className="text-xs text-slate-700 flex justify-between pt-1 border-t border-slate-200/60">
                  <span>Reserved: <strong>{res.quantity} {res.unit}</strong></span>
                  <span>Estimated Harvest: <strong>{res.estimatedHarvestDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catalog of Upcoming Harvest Batches */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Upcoming Crop Harvests ({upcomingBatches.length})
          </h2>
          <p className="text-xs text-slate-500">
            Batches currently cultivating and ripening in local fields.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : upcomingBatches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
            <CalendarClock className="w-10 h-10 text-forest-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-slate-800">No Pre-Harvest Listings Currently</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon as producers schedule new cultivation cycles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-3xl border border-cream-200 shadow-soft p-6 flex flex-col justify-between space-y-4 hover:shadow-elevated transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Ripening on Branch
                    </span>
                    <span className="font-mono text-xs text-slate-400">{batch.batchNumber}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900">{batch.listingTitle}</h3>

                  <div className="p-3 bg-cream-100/80 rounded-2xl border border-cream-300/80 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Estimated Harvest Date:</span>
                      <span className="font-bold text-forest-900">{batch.harvestDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Available Pre-Order Quota:</span>
                      <span className="font-bold text-forest-900">{batch.availableQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Storage Conditioning:</span>
                      <span className="text-slate-700">{batch.storageCondition}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBatch(batch)}
                  className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Reserve Ahead of Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservation Modal */}
      {selectedBatch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedBatch(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated border border-slate-100 text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBatch(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Advance Pre-Order</span>
              <h3 className="font-display font-bold text-xl text-slate-900">{selectedBatch.listingTitle}</h3>
              <p className="text-xs text-slate-500">Batch {selectedBatch.batchNumber} • Harvest {selectedBatch.harvestDate}</p>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Quantity to Reserve
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedBatch.availableQuantity}
                  value={reserveQty}
                  onChange={(e) => setReserveQty(Number(e.target.value))}
                  className="w-full p-3 bg-cream-50 rounded-xl text-sm font-bold text-slate-800 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Max available for reservation: {selectedBatch.availableQuantity}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Special Notes or Delivery Instructions
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please select slightly greener bunch if possible for longer ripening"
                  className="w-full p-3 bg-cream-50 rounded-xl text-xs text-slate-800 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Reservation Terms:</strong> Stock is reserved from the upcoming harvest. Payment is settled once the producer confirms harvest readiness.
              </div>

              <button
                type="submit"
                disabled={reserving}
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md disabled:opacity-50"
              >
                {reserving ? 'Submitting Reservation...' : 'Confirm Pre-Harvest Reservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
