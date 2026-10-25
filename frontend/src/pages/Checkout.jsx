import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  CheckCircle,
  Truck,
  Store
} from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, cartTotal, farmId, farmName, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState('FARM_PICKUP');
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '42 Elmwood Grove, Greenfield District');
  const [paymentMethod, setPaymentMethod] = useState('SIMULATED_ONLINE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch available farm slots
  useEffect(() => {
    if (farmId) {
      const fetchSlots = async () => {
        try {
          const res = await api.get(`/farms/${farmId}/slots`);
          setDeliverySlots(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedSlotId(String(res.data[0].id));
          }
        } catch (err) {
          console.warn('Failed to load farm delivery slots:', err.message);
        }
      };
      fetchSlots();
    }
  }, [farmId]);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedSlot = deliverySlots.find(s => String(s.id) === String(selectedSlotId));
  const deliveryFee = fulfillmentType === 'LOCAL_DELIVERY' && selectedSlot?.deliveryFee ? Number(selectedSlot.deliveryFee) : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const isSurplusRescue = cartItems.some(i => i.isSurplus);
      const payload = {
        farmId: farmId,
        fulfillmentType: fulfillmentType,
        deliverySlotId: selectedSlotId ? Number(selectedSlotId) : null,
        deliveryAddress: fulfillmentType === 'LOCAL_DELIVERY' ? deliveryAddress : 'Farm Gate Pickup',
        paymentMethod: paymentMethod,
        isSurplusRescue: isSurplusRescue,
        items: cartItems.map(item => ({
          harvestBatchId: item.harvestBatchId,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/orders/checkout', payload);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D6A4F', '#52B788', '#D97706', '#E9C46A'],
      });

      clearCart();
      navigate(`/buyer/orders?placed=${res.data?.orderNumber || 'success'}`);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please inspect stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-forest-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Basket</span>
      </Link>

      <div className="pb-4 border-b border-cream-200">
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Checkout & Slot Confirmation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct fulfillment from {farmName}. Pessimistic stock locking active.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fulfillment & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Fulfillment Type */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Fulfillment Option</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('FARM_PICKUP')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  fulfillmentType === 'FARM_PICKUP'
                    ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                    : 'border-cream-300 hover:bg-slate-50'
                }`}
              >
                <Store className="w-5 h-5 text-forest-700 mb-2" />
                <div className="font-display font-bold text-sm text-slate-900">Farm Gate Pickup</div>
                <div className="text-[11px] text-slate-500">Pick up fresh directly at the farm (Free)</div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('LOCAL_DELIVERY')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  fulfillmentType === 'LOCAL_DELIVERY'
                    ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                    : 'border-cream-300 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-5 h-5 text-forest-700 mb-2" />
                <div className="font-display font-bold text-sm text-slate-900">Local Farm Delivery</div>
                <div className="text-[11px] text-slate-500">Scheduled cold delivery to your address</div>
              </button>
            </div>

            {/* Time Slot Selection */}
            {deliverySlots.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Time Slot & Capacity Window
                </label>
                <div className="space-y-2">
                  {deliverySlots
                    .filter(s => s.slotType === fulfillmentType || true)
                    .map((slot) => (
                      <label
                        key={slot.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          String(selectedSlotId) === String(slot.id)
                            ? 'bg-forest-50 border-forest-600'
                            : 'bg-white border-cream-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="slotId"
                            value={slot.id}
                            checked={String(selectedSlotId) === String(slot.id)}
                            onChange={(e) => setSelectedSlotId(e.target.value)}
                            className="text-forest-600 focus:ring-forest-500"
                          />
                          <div>
                            <span className="font-bold text-slate-900">{slot.slotDate}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <span className="font-medium text-slate-700">{slot.startTime} - {slot.endTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {slot.availableCapacity} slots left
                          </span>
                          {slot.deliveryFee > 0 && (
                            <span className="font-bold text-slate-700">+${Number(slot.deliveryFee).toFixed(2)}</span>
                          )}
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Delivery Address if local delivery */}
            {fulfillmentType === 'LOCAL_DELIVERY' && (
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Delivery Destination Address
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street address, apartment/suite number, district"
                  className="w-full p-3 bg-cream-50 rounded-xl text-xs border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Payment Gateway</span>
            </h3>

            <div className="space-y-2">
              <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'SIMULATED_ONLINE' ? 'bg-forest-50 border-forest-600' : 'bg-white border-cream-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SIMULATED_ONLINE"
                    checked={paymentMethod === 'SIMULATED_ONLINE'}
                    onChange={() => setPaymentMethod('SIMULATED_ONLINE')}
                    className="text-forest-600 focus:ring-forest-500"
                  />
                  <div>
                    <div className="font-display font-bold text-xs text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-forest-700" />
                      <span>Simulated Online Payment (Card / UPI Sandbox)</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Instant test authorization without real charge</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Auto-Confirmed
                </span>
              </label>

              <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'CASH_ON_PICKUP' ? 'bg-forest-50 border-forest-600' : 'bg-white border-cream-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_PICKUP"
                    checked={paymentMethod === 'CASH_ON_PICKUP'}
                    onChange={() => setPaymentMethod('CASH_ON_PICKUP')}
                    className="text-forest-600 focus:ring-forest-500"
                  />
                  <div>
                    <div className="font-display font-bold text-xs text-slate-900 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-forest-700" />
                      <span>Cash on Pickup / Doorstep Delivery</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Pay directly in person when collecting produce</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Produce item rows */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.harvestBatchId} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x {item.title}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">Batch: {item.batchNumber}</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Produce Subtotal</span>
                <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Fee</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-slate-900">Total Amount</span>
              <span className="font-display font-extrabold text-2xl text-forest-900">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <span>Locking Inventory & Processing...</span>
              ) : (
                <span>Confirm & Place Order (${grandTotal.toFixed(2)})</span>
              )}
            </button>

            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 leading-normal border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1 -mt-0.5" />
              <strong>Pessimistic Stock Reservation:</strong> Quantities are locked directly at database level to guarantee zero overselling.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
