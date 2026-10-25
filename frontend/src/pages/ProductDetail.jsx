import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  QrCode, 
  ShoppingBag, 
  Check, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Share2,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import FreshnessBadge from '../components/FreshnessBadge';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [produce, setProduce] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/produce/${id}`);
        setProduce(res.data);
        if (res.data?.batches && res.data.batches.length > 0) {
          // Select first active batch by default
          const active = res.data.batches.find(b => b.status === 'ACTIVE') || res.data.batches[0];
          setSelectedBatch(active);
        }

        const revRes = await api.get(`/reviews/produce/${id}`);
        setReviews(revRes.data || []);
      } catch (err) {
        console.error('Error fetching produce details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-slate-800">Produce Item Not Found</h2>
        <Link to="/marketplace" className="inline-flex px-5 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-bold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedBatch) {
      alert('Please select an active harvest batch first.');
      return;
    }
    addToCart(produce, selectedBatch, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-cream-200 shadow-soft">
            <img
              src={produce.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'}
              alt={produce.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-800/85 text-emerald-300 backdrop-blur-md border border-emerald-400/20">
              {produce.farmingMethod?.replace('_', ' ')}
            </span>
          </div>

          {/* Quick Info bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-2xl border border-cream-200 shadow-sm">
              <div className="text-[11px] text-slate-400">Crop Variety</div>
              <div className="text-xs font-bold text-slate-800 truncate">{produce.cropVariety}</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cream-200 shadow-sm">
              <div className="text-[11px] text-slate-400">Shelf Life</div>
              <div className="text-xs font-bold text-slate-800">{produce.shelfLifeDays} days</div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cream-200 shadow-sm">
              <div className="text-[11px] text-slate-400">Category</div>
              <div className="text-xs font-bold text-slate-800">{produce.categoryName}</div>
            </div>
          </div>
        </div>

        {/* Right: Order Specifications & Freshness */}
        <div className="lg:col-span-6 space-y-6">
          {/* Farm Link & Title */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-forest-700 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{produce.farmName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">{produce.farmCity}</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {produce.title}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {produce.description}
            </p>
          </div>

          {/* Price */}
          <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300/80 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Producer Direct Price</span>
              <span className="font-display font-extrabold text-3xl text-forest-900">
                ${Number(produce.basePricePerUnit).toFixed(2)}
              </span>
              <span className="text-xs text-slate-600 font-medium ml-1">per {produce.unit}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              100% Direct Sale
            </span>
          </div>

          {/* Harvest Batch Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Harvest Batch
              </label>
              {selectedBatch && (
                <Link
                  to={`/traceability/${selectedBatch.batchNumber}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-forest-600 hover:text-forest-800"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Inspect QR Passport</span>
                </Link>
              )}
            </div>

            <div className="space-y-2">
              {produce.batches?.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedBatch?.id === batch.id
                      ? 'bg-forest-50 border-forest-600 shadow-sm'
                      : 'bg-white border-cream-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{batch.batchNumber}</span>
                      <span className="text-[11px] text-slate-500">
                        • Harvested {batch.harvestDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Storage: {batch.storageCondition} | Available: {batch.availableQuantity} {produce.unit}
                    </div>
                  </div>

                  <FreshnessBadge batch={batch} />
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-cream-100 font-bold text-slate-600 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedBatch?.availableQuantity || 99, quantity + 1))}
                  className="w-8 h-8 rounded-lg hover:bg-cream-100 font-bold text-slate-600 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedBatch || selectedBatch.availableQuantity <= 0}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : !selectedBatch || selectedBatch.availableQuantity <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-forest-600 hover:bg-forest-700 text-white hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add {quantity} {produce.unit} to Basket (${(quantity * produce.basePricePerUnit).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Pessimistic stock reservation locks inventory at checkout to prevent overselling.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t border-cream-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-2xl text-slate-900">
              Verified Buyer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-slate-500">
              Only buyers who completed delivered orders can review this produce item.
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-cream-200 text-center text-xs text-slate-400">
            No customer reviews yet. Be the first to order and review this harvest!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{rev.buyerName}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Purchase Order</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
