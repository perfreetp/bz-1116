import { useState } from 'react';
import { Search, MapPin, Navigation, Locate, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreStore } from '@/store/useStoreStore';
import { formatPrice, formatDistance } from '@/utils/format';

export const MapSearch = () => {
  const { stores, setSelectedStore, selectedStore } = useStoreStore();
  const [searchText, setSearchText] = useState('');

  const mapBounds = { minLat: 39.8, maxLat: 40.15, minLng: 116.2, maxLng: 116.7 };

  const latToY = (lat: number) => {
    return ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    return ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  };

  const filteredStores = stores.filter((s) =>
    searchText
      ? s.name.includes(searchText) || s.address.includes(searchText)
      : true
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] min-h-[600px] animate-fade-in">
      <div className="lg:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索地点或寄存点"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-warm-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors">
            <Locate className="w-4 h-4" />
            使用当前位置
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">附近寄存点</h3>
            <p className="text-sm text-gray-500 mt-1">共 {filteredStores.length} 个寄存点</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                  selectedStore?.id === store.id
                    ? 'bg-primary-50 border-l-4 border-l-primary-500'
                    : 'hover:bg-warm-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={store.images[0]}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{store.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="line-clamp-1">{store.address}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary-600 font-bold text-sm">
                        {formatPrice(store.pricePerHour)}
                        <span className="text-xs font-normal text-gray-400">/时</span>
                      </span>
                      {store.distance && (
                        <span className="text-xs text-gray-400">
                          {formatDistance(store.distance)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-200/40 rounded-full blur-3xl" />

          {filteredStores.map((store) => {
            const x = lngToX(store.lng);
            const y = latToY(store.lat);
            const isSelected = selectedStore?.id === store.id;

            return (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`absolute -translate-x-1/2 -translate-y-full transition-all ${
                  isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className={`relative px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {formatPrice(store.pricePerHour)}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 ${
                      isSelected ? 'bg-primary-500' : 'bg-white'
                    }`}
                  />
                </div>
              </button>
            );
          })}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="relative">
              <div className="w-5 h-5 bg-primary-500 rounded-full border-3 border-white shadow-lg pulse-ring" />
              <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-30" />
            </div>
          </div>
        </div>

        {selectedStore && (
          <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-5 shadow-soft-lg animate-slide-up z-40">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img
                  src={selectedStore.images[0]}
                  alt={selectedStore.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg">{selectedStore.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {selectedStore.address}
                </p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="text-primary-600 font-bold text-lg">
                    {formatPrice(selectedStore.pricePerHour)}
                    <span className="text-xs font-normal text-gray-400">/小时</span>
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{selectedStore.businessHours}</span>
                </div>
              </div>
              <Link
                to={`/order/create/${selectedStore.id}`}
                className="flex items-center gap-1 px-5 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors self-center shrink-0"
              >
                立即寄存
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-soft flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors z-40">
          <Navigation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
