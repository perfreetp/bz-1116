import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import { Store } from '@/types';
import { formatPrice, formatDistance } from '@/utils/format';
import { CapacityBar } from '@/components/common/CapacityBar';

interface StoreCardProps {
  store: Store;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  const totalAvailable =
    store.capacity.small.available +
    store.capacity.medium.available +
    store.capacity.large.available;
  const totalCapacity =
    store.capacity.small.total +
    store.capacity.medium.total +
    store.capacity.large.total;

  return (
    <Link
      to={`/order/create/${store.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={store.images[0]}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {store.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
          <span className="text-xs opacity-90">起</span>
          <span className="text-lg font-bold">{formatPrice(store.pricePerHour)}</span>
          <span className="text-xs opacity-90">/小时</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {store.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-700">{store.rating}</span>
            <span className="text-xs text-gray-400">({store.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{store.address}</span>
          {store.distance && (
            <span className="text-primary-600 font-medium shrink-0">
              {formatDistance(store.distance)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 shrink-0" />
          <span>营业时间：{store.businessHours}</span>
        </div>

        <div className="space-y-1.5 mb-4">
          <CapacityBar
            available={store.capacity.small.available}
            total={store.capacity.small.total}
            label="小型"
          />
          <CapacityBar
            available={store.capacity.medium.available}
            total={store.capacity.medium.total}
            label="中型"
          />
          <CapacityBar
            available={store.capacity.large.available}
            total={store.capacity.large.total}
            label="大型"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            剩余容量 <span className="font-semibold text-secondary-600">{totalAvailable}</span>
            <span className="text-gray-400">/{totalCapacity} 格</span>
          </div>
          <div className="flex items-center text-primary-500 font-medium text-sm group-hover:text-primary-600">
            立即寄存
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
