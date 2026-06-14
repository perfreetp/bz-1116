import { useState } from 'react';
import {
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  Camera,
  Layers,
  AlertTriangle,
  CalendarClock,
  CheckCircle,
  Search,
  MoreHorizontal,
  MapPin,
  QrCode,
  Edit,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatPrice, formatDuration } from '@/utils/format';
import { OrderStatus } from '@/types';

const tabs: { value: string; label: string; icon: typeof Package }[] = [
  { value: 'pending', label: '待入库', icon: Clock },
  { value: 'stored', label: '寄存中', icon: Package },
  { value: 'overdue', label: '已超时', icon: AlertTriangle },
  { value: 'completed', label: '已完成', icon: CheckCircle },
];

export const StoreWorkbench = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const storeOrders = orders.filter((o) => o.storeId === currentUser?.storeId || true);

  const todayOrders = storeOrders.filter((o) => {
    const today = new Date().toISOString().slice(0, 10);
    return o.createdAt.startsWith(today.replace(/-/g, '-'));
  });

  const storedCount = storeOrders.filter(
    (o) => o.status === 'stored' || o.status === 'extended'
  ).length;

  const pendingCount = storeOrders.filter((o) => o.status === 'pending').length;

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const filteredOrders = storeOrders.filter((o) => {
    if (activeTab === 'stored') {
      return o.status === 'stored' || o.status === 'extended';
    }
    return o.status === activeTab;
  });

  const handleMarkStored = (orderId: string) => {
    updateOrderStatus(orderId, 'stored');
  };

  const handleMarkOverdue = (orderId: string) => {
    updateOrderStatus(orderId, 'overdue');
  };

  const handleExtend = (orderId: string) => {
    updateOrderStatus(orderId, 'extended');
  };

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  const stats = [
    {
      label: '今日寄存',
      value: todayOrders.length,
      icon: Package,
      color: 'from-primary-400 to-primary-600',
    },
    {
      label: '在存数量',
      value: storedCount,
      icon: Layers,
      color: 'from-secondary-400 to-secondary-600',
    },
    {
      label: '待入库',
      value: pendingCount,
      icon: Clock,
      color: 'from-amber-400 to-amber-600',
    },
    {
      label: '今日营收',
      value: `¥${todayRevenue}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">门店工作台</h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentUser?.name || '北京站店'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors">
            <QrCode className="w-4 h-4" />
            扫码核验
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-soft relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-8 translate-x-8`}
              />
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const count =
                  tab.value === 'stored'
                    ? storeOrders.filter(
                        (o) => o.status === 'stored' || o.status === 'extended'
                      ).length
                    : storeOrders.filter((o) => o.status === tab.value).length;

                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.value
                        ? 'bg-primary-500 text-white shadow-orange-glow'
                        : 'text-gray-600 hover:bg-warm-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.value
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索取件码..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="pl-9 pr-4 py-2 bg-warm-50 rounded-lg text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 hover:bg-warm-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-500">
                        {order.pickupCode}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-700 mt-1 font-medium">
                      {order.customerName} · {order.customerPhone}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(order.startTime, order.endTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {order.items.length}件行李
                  </span>
                  <span className="text-primary-600 font-medium">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>

                {order.lockerNumber && (
                  <div className="flex items-center gap-2 text-sm text-secondary-600 mb-3">
                    <Layers className="w-4 h-4" />
                    <span>柜位：{order.lockerNumber}</span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleMarkStored(order.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-secondary-500 text-white text-sm rounded-lg hover:bg-secondary-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        确认入库
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 bg-warm-100 text-gray-600 text-sm rounded-lg hover:bg-warm-200 transition-colors">
                        <Camera className="w-4 h-4" />
                        拍照留档
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 bg-warm-100 text-gray-600 text-sm rounded-lg hover:bg-warm-200 transition-colors">
                        <Edit className="w-4 h-4" />
                        分配柜位
                      </button>
                    </>
                  )}

                  {(order.status === 'stored' || order.status === 'extended') && (
                    <>
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        确认取件
                      </button>
                      <button
                        onClick={() => handleExtend(order.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-warm-100 text-gray-600 text-sm rounded-lg hover:bg-warm-200 transition-colors"
                      >
                        <CalendarClock className="w-4 h-4" />
                        办理续存
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 bg-warm-100 text-gray-600 text-sm rounded-lg hover:bg-warm-200 transition-colors">
                        <Edit className="w-4 h-4" />
                        修改柜位
                      </button>
                    </>
                  )}

                  {order.status === 'stored' && (
                    <button
                      onClick={() => handleMarkOverdue(order.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      标记超时
                    </button>
                  )}

                  {order.status === 'overdue' && (
                    <button
                      onClick={() => handleComplete(order.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      确认取件
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">暂无订单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
