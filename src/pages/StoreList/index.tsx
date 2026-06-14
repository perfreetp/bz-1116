import { Search, SlidersHorizontal, X, ArrowUpDown, MapPin } from 'lucide-react';
import { useStoreStore } from '@/store/useStoreStore';
import { StoreCard } from '@/components/StoreCard/StoreCard';
import { useMemo, useState } from 'react';

const sizeOptions = [
  { value: 'all', label: '全部尺寸' },
  { value: 'small', label: '小型' },
  { value: 'medium', label: '中型' },
  { value: 'large', label: '大型' },
];

const ratingOptions = [
  { value: 0, label: '全部评分' },
  { value: 4.5, label: '4.5分以上' },
  { value: 4, label: '4分以上' },
];

const sortOptions = [
  { value: 'default', label: '综合排序' },
  { value: 'distance', label: '距离最近' },
  { value: 'price', label: '价格最低' },
  { value: 'rating', label: '评分最高' },
];

export const StoreList = () => {
  const { filters, setFilters, getFilteredStores } = useStoreStore();
  const [showFilters, setShowFilters] = useState(false);

  const filteredStores = useMemo(() => getFilteredStores(), [filters, getFilteredStores]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative">
        <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-3xl p-8 md:p-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">轻松寄存，轻装出行</h1>
          <p className="text-white/80 text-lg mb-6">
            车站周边1000+寄存点，安全便捷，随存随取
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索寄存点名称或地址..."
                value={filters.searchKeyword}
                onChange={(e) => setFilters({ searchKeyword: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>筛选</span>
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-soft animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">筛选条件</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                行李尺寸
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilters({ sizeFilter: opt.value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.sizeFilter === opt.value
                        ? 'bg-primary-500 text-white shadow-orange-glow'
                        : 'bg-warm-50 text-gray-600 hover:bg-warm-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                最低评分
              </label>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilters({ minRating: opt.value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.minRating === opt.value
                        ? 'bg-primary-500 text-white shadow-orange-glow'
                        : 'bg-warm-50 text-gray-600 hover:bg-warm-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                价格区间：¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}/小时
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({ priceRange: [0, Number(e.target.value)] })
                }
                className="w-full h-2 bg-warm-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>¥0</span>
                <span>¥50</span>
                <span>¥100+</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() =>
                setFilters({
                  searchKeyword: '',
                  sizeFilter: 'all',
                  priceRange: [0, 100],
                  minRating: 0,
                  sortBy: 'default',
                })
              }
              className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              重置筛选
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          共找到 <span className="font-semibold text-primary-600">{filteredStores.length}</span> 个寄存点
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ sortBy: e.target.value as typeof filters.sortBy })
            }
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无符合条件的寄存点</h3>
          <p className="text-gray-500">试试调整筛选条件看看吧</p>
        </div>
      )}
    </div>
  );
};
