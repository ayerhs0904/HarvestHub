import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Calendar, 
  QrCode, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Truck, 
  DollarSign,
  AlertTriangle,
  X
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'slots', 'traceability'

  const [farm, setFarm] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Produce Modal
  const [newProduceModal, setNewProduceModal] = useState(false);
  const [produceTitle, setProduceTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [cropVariety, setCropVariety] = useState('');
  const [unit, setUnit] = useState('KG');
  const [basePrice, setBasePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState(7);

  // New Batch Modal
  const [newBatchModal, setNewBatchModal] = useState(false);
  const [selectedProduceId, setSelectedProduceId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [initialQty, setInitialQty] = useState(100);
  const [freshnessWindowDays, setFreshnessWindowDays] = useState(7);
  const [storageCondition, setStorageCondition] = useState('Cool Cellar (14°C - 16°C)');
  const [batchStatus, setBatchStatus] = useState('ACTIVE');

  // New Traceability Event Modal
  const [eventModal, setEventModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [eventStage, setEventStage] = useState('HARVEST');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [operatorName, setOperatorName] = useState('');

  // New Slot Modal
  const [slotModal, setSlotModal] = useState(false);
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [slotType, setSlotType] = useState('FARM_PICKUP');
  const [maxCapacity, setMaxCapacity] = useState(15);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const farmRes = await api.get('/farmer/farm');
      setFarm(farmRes.data);

      const invRes = await api.get('/farmer/inventory');
      setInventory(invRes.data || []);

      const ordersRes = await api.get('/farmer/orders');
      setOrders(ordersRes.data || []);

      const catRes = await api.get('/categories');
      setCategories(catRes.data || []);
      if (catRes.data?.length > 0) setCategoryId(String(catRes.data[0].id));
    } catch (err) {
      console.warn('Farmer data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const handleCreateProduce = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farmer/produce', {
        categoryId: Number(categoryId),
        title: produceTitle,
        description,
        cropVariety,
        unit,
        basePricePerUnit: Number(basePrice),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop',
        shelfLifeDays: Number(shelfLifeDays),
      });
      alert('Produce listing created successfully!');
      setNewProduceModal(false);
      setProduceTitle('');
      fetchFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to create listing.');
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/farmer/produce/${selectedProduceId}/batches`, {
        batchNumber,
        harvestDate,
        initialQuantity: Number(initialQty),
        freshnessWindowDays: Number(freshnessWindowDays),
        storageCondition,
        status: batchStatus,
      });
      alert('Harvest batch logged successfully!');
      setNewBatchModal(false);
      fetchFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to add batch.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/farmer/batches/${selectedBatchId}/events`, {
        stage: eventStage,
        eventTimestamp: new Date().toISOString(),
        location: eventLocation || farm?.city || 'Cauvery Basin Plot 4A',
        description: eventDesc,
        operatorName: operatorName || user?.fullName,
      });
      alert('Lifecycle traceability event recorded! Visible on the QR passport.');
      setEventModal(false);
      fetchFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to record event.');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farmer/slots', {
        slotDate,
        startTime,
        endTime,
        slotType,
        maxCapacity: Number(maxCapacity),
        deliveryFee: Number(deliveryFee),
      });
      alert('Time slot scheduled successfully!');
      setSlotModal(false);
      fetchFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to schedule slot.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/farmer/orders/${orderId}/status`, { status: newStatus });
      fetchFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  // KPI calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'PLACED' || o.status === 'ACCEPTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Verification Seal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              {farm?.farmName || 'Farmer Dashboard'}
            </h1>
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              farm?.verificationStatus === 'VERIFIED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{farm?.verificationStatus || 'PENDING'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {farm?.city}, {farm?.state} • Farming Method: <strong>{farm?.farmingMethod?.replace('_', ' ')}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewProduceModal(true)}
            className="px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Produce Item</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Sales Revenue</span>
          <span className="font-display font-extrabold text-2xl text-forest-900">${totalRevenue.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">100% Direct to Producer</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Listings</span>
          <span className="font-display font-extrabold text-2xl text-slate-900">{inventory.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Produce catalog items</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pending Orders</span>
          <span className="font-display font-extrabold text-2xl text-amber-600">{pendingOrdersCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Requires packing & fulfillment</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Orders Fulfilled</span>
          <span className="font-display font-extrabold text-2xl text-emerald-700">
            {orders.filter(o => o.status === 'DELIVERED').length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Successful customer deliveries</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders' ? 'bg-forest-600 text-white' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'inventory' ? 'bg-forest-600 text-white' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Produce & Batches ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('traceability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'traceability' ? 'bg-forest-600 text-white' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Traceability Passport Logger
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'slots' ? 'bg-forest-600 text-white' : 'text-slate-600 hover:bg-cream-100'
          }`}
        >
          Pickup & Delivery Slots
        </button>
      </div>

      {/* Tab 1: Orders Fulfill Stepper */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 text-xs text-slate-400">
              No customer orders received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{order.orderNumber}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Buyer: <strong>{order.buyerName}</strong> ({order.buyerEmail})
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="font-display font-extrabold text-base text-forest-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                      <span className="text-slate-400 uppercase text-[10px]">{order.fulfillmentType}</span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {order.items?.map((item) => (
                      <div key={item.id} className="p-2.5 bg-cream-50 rounded-xl border border-cream-200/60 flex justify-between">
                        <span>{item.quantity} {item.unit} x {item.produceTitle} (Batch: {item.batchNumber})</span>
                        <span className="font-bold">${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Change Buttons Stepper */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase text-slate-400 mr-2">Update Stage:</span>

                    {order.status === 'PLACED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
                        className="px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold"
                      >
                        Accept Order
                      </button>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                      >
                        Start Picking & Packing
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                      >
                        Mark Ready for Pickup / Transit
                      </button>
                    )}

                    {(order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY') && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                      >
                        Complete Delivery
                      </button>
                    )}

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Cancel order? Deducted inventory will be restored to your batch.')) {
                            handleUpdateOrderStatus(order.id, 'CANCELLED');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold ml-auto"
                      >
                        Cancel & Return Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Produce & Batches */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map((prod) => (
              <div key={prod.id} className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100"
                  />
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 leading-snug">{prod.title}</h3>
                    <div className="text-xs text-slate-500">{prod.cropVariety} • ${Number(prod.basePricePerUnit).toFixed(2)}/{prod.unit}</div>
                  </div>
                </div>

                {/* Batches for this listing */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Harvest Batches ({prod.batches?.length || 0})</span>
                    <button
                      onClick={() => {
                        setSelectedProduceId(String(prod.id));
                        setBatchNumber(`BATCH-2026-${prod.cropVariety.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`);
                        setHarvestDate(new Date().toISOString().split('T')[0]);
                        setNewBatchModal(true);
                      }}
                      className="text-forest-600 hover:text-forest-800 text-[11px] font-bold"
                    >
                      + Add Batch
                    </button>
                  </div>

                  {prod.batches?.map((batch) => (
                    <div key={batch.id} className="p-2 bg-cream-50 rounded-xl text-[11px] flex justify-between items-center text-slate-700">
                      <div>
                        <span className="font-mono font-bold">{batch.batchNumber}</span>
                        <span className="text-slate-400 ml-1">({batch.harvestDate})</span>
                      </div>
                      <span className="font-bold text-emerald-800">{batch.availableQuantity} {prod.unit} available</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Traceability Event Logger */}
      {activeTab === 'traceability' && (
        <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Log Traceability Event for Batch
              </h3>
              <p className="text-xs text-slate-500">
                Record agronomic milestones (Seeding, Cultivation, Harvest, Packing) to populate the public QR passport.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Harvest Batch
              </label>
              <select
                required
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300 font-medium"
              >
                <option value="">Select Batch...</option>
                {inventory.flatMap(p => p.batches || []).map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber} ({b.listingTitle}) - Harvested: {b.harvestDate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Lifecycle Stage
              </label>
              <select
                value={eventStage}
                onChange={(e) => setEventStage(e.target.value)}
                className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300 font-medium"
              >
                <option value="SEEDING">Seed Selection & Sowing</option>
                <option value="CULTIVATION">Organic Cultivation & Care</option>
                <option value="HARVEST">Harvest at Peak Ripeness</option>
                <option value="QUALITY_INSPECTION">Quality & Brix Inspection</option>
                <option value="PACKAGING">Sustainable Packaging</option>
                <option value="DISPATCH_TO_HUB">Cold-Chain Dispatch</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Field Location / Packhouse
              </label>
              <input
                type="text"
                placeholder="e.g. Open Field Cauvery Basin Plot 4A"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Operator / Field Specialist Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Patel"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Agronomic Description & Observations
              </label>
              <textarea
                rows="3"
                required
                placeholder="Describe procedures, soil enrichment, sugar brix testing score, or ambient packing temperature..."
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full p-3 bg-cream-50 rounded-xl border border-cream-300"
              ></textarea>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="py-3 px-6 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Publish Traceability Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Slots Scheduler */}
      {activeTab === 'slots' && (
        <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Configure Pickup & Delivery Windows
              </h3>
              <p className="text-xs text-slate-500">
                Establish operating capacity quotas to prevent order overwhelm during harvest picking days.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Slot Type
              </label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value)}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-medium"
              >
                <option value="FARM_PICKUP">Farm Gate Pickup (Free)</option>
                <option value="LOCAL_DELIVERY">Local Delivery Service</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Max Capacity Quota
              </label>
              <input
                type="number"
                min="1"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Delivery Charge ($)
              </label>
              <input
                type="number"
                step="0.50"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="py-3 px-6 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Save Schedule Window
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Produce Modal */}
      {newProduceModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setNewProduceModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-elevated text-slate-800 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNewProduceModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-4">
              Add New Produce Listing
            </h3>

            <form onSubmit={handleCreateProduce} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Produce Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Heirloom Cherry Tomatoes"
                  value={produceTitle}
                  onChange={(e) => setProduceTitle(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Crop Variety
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Marzano"
                    value={cropVariety}
                    onChange={(e) => setCropVariety(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-medium"
                  >
                    <option value="KG">KG</option>
                    <option value="BUNCH">BUNCH</option>
                    <option value="CRATE">CRATE</option>
                    <option value="DOZEN">DOZEN</option>
                    <option value="BOX">BOX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    placeholder="2.50"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    value={shelfLifeDays}
                    onChange={(e) => setShelfLifeDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Culinary Description & Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe taste profile, optimal culinary usage, and farming practices..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md mt-2"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Batch Modal */}
      {newBatchModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setNewBatchModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated text-slate-800 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNewBatchModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-900 mb-4">
              Log Harvest Batch
            </h3>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Batch Code Number
                </label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl font-mono font-bold border border-cream-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Batch Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={initialQty}
                    onChange={(e) => setInitialQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl font-bold border border-cream-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Freshness Window (Days)
                  </label>
                  <input
                    type="number"
                    value={freshnessWindowDays}
                    onChange={(e) => setFreshnessWindowDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Batch Status
                  </label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300 font-medium"
                  >
                    <option value="ACTIVE">ACTIVE (Harvested & Ready)</option>
                    <option value="UPCOMING">UPCOMING (Pre-Harvest Booking)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 rounded-xl border border-cream-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl font-bold text-xs transition-colors shadow-md mt-2"
              >
                Log Harvest Batch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
