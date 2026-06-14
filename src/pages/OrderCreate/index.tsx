import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  Shield,
  Plus,
  Minus,
  ChevronDown,
  Check,
  ArrowLeft,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { useStoreStore } from '@/store/useStoreStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useUserStore } from '@/store/useUserStore';
import { OrderItem } from '@/types';
import { formatPrice, getSizeText, generatePickupCode, generateOrderId } from '@/utils/format';
import { calculateBasePrice, calculateInsurancePremium } from '@/utils/calculator';

const sizeOptions = [
  { value: 'small', label: '小型包', desc: '背包、手提袋等', icon: '🎒' },
  { value: 'medium', label: '中型箱', desc: '20-24寸行李箱', icon: '🧳' },
  { value: 'large', label: '大型箱', desc: '28寸以上大箱', icon: '🛅' },
];

const insuranceOptions = [
  { value: 0, label: '不需要', premium: 0 },
  { value: 500, label: '500元', premium: 5 },
  { value: 1000, label: '1000元', premium: 10 },
  { value: 2000, label: '2000元', premium: 20 },
  { value: 5000, label: '5000元', premium: 50 },
];

export const OrderCreate = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stores } = useStoreStore();
  const { addOrder, getOrderById } = useOrderStore();
  const { currentUser } = useUserStore();

  const store = stores.find((s) => s.id === storeId);
  const successOrderId = searchParams.get('success');
  const successOrder = successOrderId ? getOrderById(successOrderId) : null;

  const now = new Date();
  const formatDateTimeLocal = (d: Date) =>
    d.toISOString().slice(0, 16);

  const [startTime, setStartTime] = useState(formatDateTimeLocal(now));
  const [endTime, setEndTime] = useState(
    formatDateTimeLocal(new Date(now.getTime() + 6 * 60 * 60 * 1000))
  );
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', size: 'medium', quantity: 1, description: '' },
  ]);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [description, setDescription] = useState('');
  const showSuccess = !!successOrder;
  const [newOrderId, setNewOrderId] = useState('');

  const basePrice = useMemo(() => {
    if (!store) return 0;
    return calculateBasePrice(
      store,
      startTime.replace('T', ' '),
      endTime.replace('T', ' '),
      items
    );
  }, [store, startTime, endTime, items]);

  const insurancePremium = useMemo(() => {
    if (insuranceAmount === 0) return 0;
    return calculateInsurancePremium(insuranceAmount);
  }, [insuranceAmount]);

  const totalPrice = basePrice + insurancePremium;

  const updateItemQuantity = (index: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const updateItemSize = (index: number, size: 'small' | 'medium' | 'large') => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, size } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        size: 'medium',
        quantity: 1,
        description: '',
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!store) return;

    const pickupCode = generatePickupCode();
    const orderId = generateOrderId();

    const newOrder = {
      id: orderId,
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      customerName,
      customerPhone,
      startTime: startTime.replace('T', ' '),
      endTime: endTime.replace('T', ' '),
      status: 'pending' as const,
      items: items.map((item, idx) => ({
        ...item,
        description: description || `${getSizeText(item.size)}行李${idx + 1}`,
      })),
      insurance:
        insuranceAmount > 0
          ? { amount: insuranceAmount, premium: insurancePremium }
          : undefined,
      basePrice,
      insurancePrice: insurancePremium,
      totalPrice,
      pickupCode,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    addOrder(newOrder);
    setNewOrderId(orderId);
    setSearchParams({ success: orderId });
  };

  if (!store) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">寄存点不存在</p>
      </div>
    );
  }

  if (showSuccess && successOrder) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="bg-white rounded-3xl p-8 shadow-soft text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">下单成功！</h2>
          <p className="text-gray-500 mb-6">请在预约时间内到店寄存行李</p>

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 mb-6">
            <p className="text-sm text-primary-600 mb-2">取件码</p>
            <p className="text-4xl font-bold text-primary-600 tracking-widest font-mono">
              {successOrder.pickupCode}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="text-left space-y-3 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">寄存点</span>
              <span className="text-gray-800 font-medium">{successOrder.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">地址</span>
              <span className="text-gray-800">{successOrder.storeAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">支付金额</span>
              <span className="text-primary-600 font-bold">
                {formatPrice(successOrder.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              查看订单
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-warm-100 text-gray-700 rounded-xl font-medium hover:bg-warm-200 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              寄存点信息
            </h2>
            <div className="flex gap-4">
              <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0">
                <img
                  src={store.images[0]}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{store.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {store.address}
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  营业时间：{store.businessHours}
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {store.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              存取时间
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  存入时间
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  取出时间
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                🧳 行李信息
              </h2>
              <button
                onClick={addItem}
                className="text-sm text-primary-600 font-medium hover:text-primary-700"
              >
                + 添加行李
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 bg-warm-50 rounded-xl relative"
                >
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-sm"
                    >
                      删除
                    </button>
                  )}

                  <p className="text-sm font-medium text-gray-700 mb-3">
                    行李 {index + 1}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {sizeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          updateItemSize(
                            index,
                            opt.value as 'small' | 'medium' | 'large'
                          )
                        }
                        className={`p-3 rounded-xl text-center transition-all ${
                          item.size === opt.value
                            ? 'bg-primary-500 text-white shadow-orange-glow'
                            : 'bg-white text-gray-700 hover:bg-primary-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{opt.icon}</div>
                        <div className="text-xs font-medium">{opt.label}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">数量</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateItemQuantity(index, -1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(index, 1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                物品说明（选填）
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请描述您的行李物品特征"
                rows={3}
                className="w-full px-4 py-3 bg-warm-50 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              保价服务
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {insuranceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInsuranceAmount(opt.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    insuranceAmount === opt.value
                      ? 'bg-secondary-500 text-white ring-2 ring-secondary-300'
                      : 'bg-warm-50 text-gray-700 hover:bg-secondary-50'
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  {opt.premium > 0 && (
                    <div className="text-xs opacity-80 mt-1">
                      +{formatPrice(opt.premium)}
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * 保价费为保额的1%，行李损坏或丢失可按保额赔付
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              联系人信息
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="请输入姓名"
                  className="w-full px-4 py-3 bg-warm-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full px-4 py-3 bg-warm-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">费用明细</h3>

            <div className="space-y-3 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">基础寄存费</span>
                <span className="text-gray-800">{formatPrice(basePrice)}</span>
              </div>
              {insurancePremium > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    保价费（{insuranceAmount}元）
                  </span>
                  <span className="text-gray-800">
                    {formatPrice(insurancePremium)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-gray-700 font-medium">合计</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-warm-50 rounded-xl mb-4">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">微信支付</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!customerName || !customerPhone}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold text-lg shadow-orange-glow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认支付
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              支付即表示同意《寄存服务协议》
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
