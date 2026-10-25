import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Store, 
  Star, 
  X, 
  ShieldCheck,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed' },
  { key: 'ACCEPTED', label: 'Farmer Accepted' },
  { key: 'PREPARING', label: 'Harvesting & Packing' },
  { key: 'READY_FOR_PICKUP', label: 'Ready / In Transit' },
  { key: 'DELIVERED', label: 'Delivered / Completed' },
];

export default function BuyerOrders() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load buyer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenReview = (orderId, item) => {
    setSelectedOrderId(orderId);
    setSelectedOrderItem(item);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        orderId: selectedOrderId,
        produceListingId: selectedOrderItem.produceListingId,
        rating: Number(rating),
        comment: comment,
      });
      alert('Review submitted! It now displays on the product detail page with the Verified Purchase badge.');
      setReviewModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStepIndex = (status) => {
    if (status === 'OUT_FOR_DELIVERY') return 3;
    if (status === 'CANCELLED') return -1;
    const idx = STATUS_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-cream-200">
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          My Farm Orders & Deliveries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track harvest fulfillment progress, pickup slots, and review delivered produce.
        </p>
      </div>

      {searchParams.get('placed') && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Thank you! Your order #{searchParams.get('placed')} has been placed. The farm has been alerted to prepare your fresh produce.
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 p-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-display font-bold text-xl text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any farm-direct orders yet. Explore our marketplace for fresh seasonal produce.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-cream-200 shadow-soft p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                      {order.isSurplusRescue && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Food Rescue ({order.rescuedKg} kg)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Farm: <strong>{order.farmName}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">Total Amount</span>
                    <span className="font-display font-extrabold text-xl text-forest-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold uppercase">
                      Payment: {order.paymentStatus} ({order.paymentMethod?.replace('_', ' ')})
                    </span>
                  </div>
                </div>

                {/* Status Stepper Progression */}
                {order.status !== 'CANCELLED' ? (
                  <div className="py-2">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isPastOrCurrent = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div key={step.key} className="space-y-1.5">
                            <div className={`h-2 rounded-full transition-colors ${
                              isPastOrCurrent ? 'bg-forest-600' : 'bg-slate-200'
                            }`}></div>
                            <span className={`block text-[11px] font-medium leading-tight ${
                              isCurrent ? 'font-bold text-forest-900' : isPastOrCurrent ? 'text-forest-700' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                    This order was cancelled and inventory was returned to the farm.
                  </div>
                )}

                {/* Items & Delivery Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  {/* Items */}
                  <div className="md:col-span-8 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Purchased Produce Batches
                    </span>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{item.produceTitle}</span>
                            <span className="text-slate-500 ml-1">({item.quantity} {item.unit})</span>
                            <div className="text-[10px] font-mono text-forest-700">Batch: {item.batchNumber}</div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-slate-800">
                              ${Number(item.subtotal).toFixed(2)}
                            </span>

                            {/* Review Button if order DELIVERED */}
                            {order.status === 'DELIVERED' && (
                              <button
                                onClick={() => handleOpenReview(order.id, item)}
                                className="px-3 py-1 bg-white hover:bg-cream-100 border border-cream-300 text-forest-800 font-bold text-[11px] rounded-xl flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>Rate / Review</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fulfillment details */}
                  <div className="md:col-span-4 bg-cream-50 p-4 rounded-2xl border border-cream-200/80 space-y-2 text-xs text-slate-700">
                    <span className="font-bold uppercase tracking-wider text-forest-900 text-[11px] block">
                      Fulfillment Schedule
                    </span>
                    <div className="flex items-start gap-1.5">
                      {order.fulfillmentType === 'FARM_PICKUP' ? (
                        <Store className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                      ) : (
                        <Truck className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong>{order.fulfillmentType?.replace('_', ' ')}</strong>
                        <p className="text-[11px] text-slate-500">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    {order.deliverySlot && (
                      <div className="pt-2 border-t border-cream-300/60 text-[11px]">
                        <div>Slot Date: <strong>{order.deliverySlot.slotDate}</strong></div>
                        <div>Time: <strong>{order.deliverySlot.startTime} - {order.deliverySlot.endTime}</strong></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && selectedOrderItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setReviewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Buyer Review</span>
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {selectedOrderItem.produceTitle}
              </h3>
              <p className="text-xs text-slate-500">Batch {selectedOrderItem.batchNumber}</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Rating Score (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{rating} out of 5</span>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Taste, Freshness & Condition Feedback
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details about the texture, flavor, and harvest freshness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-slate-800"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md disabled:opacity-50"
              >
                {submittingReview ? 'Submitting Review...' : 'Publish Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
