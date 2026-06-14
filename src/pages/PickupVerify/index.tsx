import { useState } from 'react';
import { QrCode, Check, X, MapPin, Clock, User } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatPrice, formatDuration } from '@/utils/format';

export const PickupVerify = () => {
  const { orders, getOrderById, updateOrderStatus } = useOrderStore();
  const { currentRole } = useUserStore();
  const [pickupCode, setPickupCode] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState<typeof orders[0] | null>(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVerify = () => {
    setError('');
    const order = orders.find((o) => o.pickupCode.toUpperCase() === pickupCode.toUpperCase());

    if (!order) {
      setError('未找到对应订单，请检查取件码是否正确');
      setVerifiedOrder(null);
      return;
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      setError('该订单已完成或已取消');
      setVerifiedOrder(null);
      return;
    }

    setVerifiedOrder(order);
  };

  const handleConfirmPickup = () => {
    if (!verifiedOrder) return;
    updateOrderStatus(verifiedOrder.id, 'completed');
    setShowSuccess(true);
  };

  const handleConfirmStorage = () => {
    if (!verifiedOrder) return;
    updateOrderStatus(verifiedOrder.id, 'stored');
    setShowSuccess(true);
  };

  const resetForm = () => {
    setPickupCode('');
    setVerifiedOrder(null);
    setError('');
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl p-8 shadow-soft text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentRole === 'store' ? '入库成功！' : '核验成功！'}
          </h2>
          <p className="text-gray-500 mb-6">
            {currentRole === 'store' ? '行李已成功入库' : '取件码核验通过'}
          </p>

          <button
            onClick={resetForm}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            继续核验
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {currentRole === 'store' ? '扫码核验' : '取件核验'}
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-soft">
        {!verifiedOrder ? (
          <>
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">扫码或输入取件码</h2>
              <p className="text-gray-500 text-sm">
                {currentRole === 'store'
                  ? '扫描顾客取件码或手动输入进行核验'
                  : '到店后出示取件码给工作人员扫描'}
              </p>
            </div>

            {currentRole === 'store' && (
              <div className="mb-8">
                <div className="aspect-square max-w-xs mx-auto bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-48 h-48 border-2 border-primary-400 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-400 -mt-0.5 -ml-0.5" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-400 -mt-0.5 -mr-0.5" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-400 -mb-0.5 -ml-0.5" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-400 -mb-0.5 -mr-0.5" />
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-400 animate-pulse" style={{
                      animation: 'scanLine 2s ease-in-out infinite',
                      marginTop: '50%'
                    }} />
                  </div>
                  <p className="absolute bottom-4 text-white/70 text-sm">将取件码放入框内</p>
                </div>
              </div>
            )}

            <div className="max-w-sm mx-auto">
              <label className="block text-sm font-medium text-gray-600 mb-2 text-center">
                或手动输入取件码
              </label>
              <input
                type="text"
                value={pickupCode}
                onChange={(e) => {
                  setPickupCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="请输入6位取件码"
                maxLength={6}
                className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest bg-warm-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />

              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-500 text-sm justify-center">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={pickupCode.length < 6}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold text-lg shadow-orange-glow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                核验取件码
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">核验通过</h3>
                <p className="text-sm text-gray-500">订单信息如下</p>
              </div>
              <StatusBadge status={verifiedOrder.status} />
            </div>

            <div className="bg-warm-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                {verifiedOrder.storeName}
              </h4>
              <p className="text-sm text-gray-500 flex items-start gap-1">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {verifiedOrder.storeAddress}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">客户姓名</p>
                  <p className="text-sm font-medium text-gray-800">
                    {verifiedOrder.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">寄存时长</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDuration(verifiedOrder.startTime, verifiedOrder.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">订单金额</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(verifiedOrder.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">行李件数</span>
                <span className="text-gray-700 text-sm">
                  {verifiedOrder.items.length} 件
                </span>
              </div>
              {verifiedOrder.insurance && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-sm">
                    保价 {verifiedOrder.insurance.amount} 元
                  </span>
                  <span className="text-secondary-600 text-sm font-medium">
                    已保价
                  </span>
                </div>
              )}
            </div>

            {currentRole === 'store' && (
              <div className="flex gap-3">
                {verifiedOrder.status === 'pending' && (
                  <button
                    onClick={handleConfirmStorage}
                    className="flex-1 py-3 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors"
                  >
                    确认入库
                  </button>
                )}
                {(verifiedOrder.status === 'stored' ||
                  verifiedOrder.status === 'overdue' ||
                  verifiedOrder.status === 'extended') && (
                  <button
                    onClick={handleConfirmPickup}
                    className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    确认取件
                  </button>
                )}
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors"
                >
                  返回
                </button>
              </div>
            )}

            {currentRole === 'visitor' && (
              <button
                onClick={resetForm}
                className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                返回
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
