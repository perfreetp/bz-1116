import { useState } from 'react';
import { Clock, MapPin, QrCode, ChevronRight, X } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatPrice, formatDuration } from '@/utils/format';
import { OrderStatus } from '@/types';

const tabs: { value: string; label: string }[] = [
  { value: 'all', label: '全部订单' },
  { value: 'pending', label: '待入库' },
  { value: 'stored', label: '寄存中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

export const OrderCenter = () => {
  const { orders, setCurrentOrder, currentOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState('all');
  const [showDetail, setShowDetail] = useState(false);

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const handleViewDetail = (order: typeof orders[0]) => {
    setCurrentOrder(order);
    setShowDetail(true);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 min-w-max px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.value
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleViewDetail(order)}
              className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">订单号：{order.id}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {order.storeName}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {order.storeAddress}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(order.startTime, order.endTime)}
                    </span>
                    <span>{order.items.length}件行李</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-primary-600">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <ChevronRight className="w-5 h-5 text-gray-300 mt-2 ml-auto" />
                </div>
              </div>

              {order.status === 'stored' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <QrCode className="w-4 h-4 text-primary-500" />
                    <span className="text-gray-600">取件码：</span>
                    <span className="font-mono font-bold text-primary-600 tracking-wider">
                      {order.pickupCode}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                    查看取件码
                  </button>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button className="px-4 py-2 bg-warm-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-warm-100 transition-colors">
                    取消订单
                  </button>
                  <button className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
                    查看取件码
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无订单</h3>
          <p className="text-gray-500 text-sm">快去寻找附近的寄存点吧</p>
        </div>
      )}

      {showDetail && currentOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">订单详情</h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">订单状态</p>
                  <StatusBadge status={currentOrder.status} />
                </div>
                <p className="text-2xl font-bold text-primary-600">
                  {formatPrice(currentOrder.totalPrice)}
                </p>
              </div>

              <div className="bg-warm-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {currentOrder.storeName}
                </h3>
                <p className="text-sm text-gray-500 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {currentOrder.storeAddress}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">寄存信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">存入时间</span>
                    <span className="text-gray-800">{currentOrder.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">预计取出</span>
                    <span className="text-gray-800">{currentOrder.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">寄存时长</span>
                    <span className="text-gray-800">
                      {formatDuration(currentOrder.startTime, currentOrder.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">行李件数</span>
                    <span className="text-gray-800">{currentOrder.items.length}件</span>
                  </div>
                  {currentOrder.lockerNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">存放柜位</span>
                      <span className="text-gray-800">{currentOrder.lockerNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">费用明细</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">基础寄存费</span>
                    <span className="text-gray-800">
                      {formatPrice(currentOrder.basePrice)}
                    </span>
                  </div>
                  {currentOrder.insurance && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        保价费（{currentOrder.insurance.amount}元）
                      </span>
                      <span className="text-gray-800">
                        {formatPrice(currentOrder.insurancePrice)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-medium text-gray-700">合计</span>
                    <span className="font-bold text-primary-600">
                      {formatPrice(currentOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {currentOrder.status === 'stored' ||
              currentOrder.status === 'pending' ? (
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-primary-600 mb-2">取件码</p>
                  <p className="text-3xl font-bold text-primary-600 tracking-widest font-mono">
                    {currentOrder.pickupCode}
                  </p>
                </div>
              ) : null}

              <div className="text-sm text-gray-400">
                <p>订单编号：{currentOrder.id}</p>
                <p>下单时间：{currentOrder.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
