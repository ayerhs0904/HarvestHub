import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, farmName } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cream-200 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500">Discover fresh organic produce directly from verified local farms.</p>
        <Link
          to="/marketplace"
          className="inline-flex px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl text-xs font-bold transition-colors shadow-md"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-cream-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Shopping Basket
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-forest-700 font-semibold mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Farm Direct from: {farmName}</span>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-600 font-medium"
        >
          Clear basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.harvestBatchId}
              className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'}
                  alt={item.title}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{item.title}</h3>
                  <div className="text-xs text-slate-500 italic">Variety: {item.cropVariety}</div>
                  <div className="text-[11px] font-mono text-forest-700 font-medium">Batch: {item.batchNumber}</div>
                  {item.isSurplus && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Surplus Rescue Discount
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => updateQuantity(item.harvestBatchId, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg hover:bg-cream-100 font-bold text-slate-600 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.harvestBatchId, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-cream-100 font-bold text-slate-600 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-display font-extrabold text-base text-slate-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ${Number(item.unitPrice).toFixed(2)} / {item.unit}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.harvestBatchId)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Proceed */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
              Basket Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Farmer Cut</span>
                <span className="font-bold text-emerald-700">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Pickup / Delivery</span>
                <span className="text-slate-400 italic">Select at Checkout</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-slate-900">Estimated Total</span>
              <span className="font-display font-extrabold text-2xl text-forest-900">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login?redirect=/checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/marketplace"
              className="block text-center text-xs font-semibold text-slate-400 hover:text-slate-600 pt-1"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
