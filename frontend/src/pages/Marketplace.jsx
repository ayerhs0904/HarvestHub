import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, X, RefreshCw } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [produceList, setProduceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const farmingMethod = searchParams.get('method') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.warn('Could not load categories:', err.message);
      }
    };
    fetchCats();
  }, []);

  // Fetch produce listings with query parameters
  useEffect(() => {
    const fetchProduce = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (search) params.append('search', search);
        if (farmingMethod) params.append('farmingMethod', farmingMethod);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        params.append('sort', sort);
        params.append('page', page);
        params.append('size', '12');

        const res = await api.get(`/produce?${params.toString()}`);
        setProduceList(res.data?.content || []);
        setTotalItems(res.data?.totalElements || 0);
      } catch (err) {
        console.error('Failed to load produce:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, [selectedCategory, search, farmingMethod, minPrice, maxPrice, sort, page]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset to page 0
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Farm-to-Market Produce
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse seasonal fresh harvests directly from verified regional farms.
          </p>
        </div>

        {/* Search Bar & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search produce or farm..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-medium border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none bg-white border border-cream-300 pl-3 pr-8 py-2 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="createdAt,desc">Newest Harvests</option>
              <option value="basePricePerUnit,asc">Price: Low to High</option>
              <option value="basePricePerUnit,desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 rounded-xl bg-forest-600 text-white"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            !selectedCategory
              ? 'bg-forest-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-cream-100 border border-cream-300/60'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilter('category', String(cat.id))}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === String(cat.id)
                ? 'bg-forest-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-cream-100 border border-cream-300/60'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid & Desktop Filter Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6`}>
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-forest-600" />
                <span>Filters</span>
              </span>
              {(selectedCategory || farmingMethod || minPrice || maxPrice || search) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Farming Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Farming Method
              </label>
              <div className="space-y-2 text-xs">
                {['', 'ORGANIC', 'REGENERATIVE', 'HYDROPONIC', 'CONVENTIONAL'].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-forest-700">
                    <input
                      type="radio"
                      name="farmingMethod"
                      checked={farmingMethod === method}
                      onChange={() => updateFilter('method', method)}
                      className="text-forest-600 focus:ring-forest-500 h-4 w-4"
                    />
                    <span>{method ? method.replace('_', ' ') : 'Any Method'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full p-2 bg-cream-50 rounded-xl text-xs border border-cream-200 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full p-2 bg-cream-50 rounded-xl text-xs border border-cream-200 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Produce Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : produceList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-cream-200 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800">No Produce Matched</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, farming method, or category filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-2 bg-forest-600 text-white rounded-xl text-xs font-bold hover:bg-forest-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-xs text-slate-400 font-medium">
                Showing {produceList.length} of {totalItems} fresh farm listings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {produceList.map((prod) => (
                  <ProductCard key={prod.id} produce={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
