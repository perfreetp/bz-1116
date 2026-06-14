import { useState } from 'react';
import {
  Building2,
  DollarSign,
  Layers,
  FileSpreadsheet,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  TrendingUp,
  Package,
  Users,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { mockStores } from '@/data/stores';
import { mockSettlements } from '@/data/tickets';
import { formatPrice } from '@/utils/format';

const tabs: { value: string; label: string; icon: typeof Building2 }[] = [
  { value: 'stores', label: '门店管理', icon: Building2 },
  { value: 'pricing', label: '价格规则', icon: DollarSign },
  { value: 'capacity', label: '容量管理', icon: Layers },
  { value: 'settlement', label: '结算明细', icon: FileSpreadsheet },
];

export const AdminReport = () => {
  const [activeTab, setActiveTab] = useState('stores');
  const [searchText, setSearchText] = useState('');

  const totalStores = mockStores.length;
  const totalOrders = 1256;
  const totalRevenue = 89600;
  const platformIncome = 17920;

  const stats = [
    {
      label: '门店总数',
      value: totalStores,
      icon: Building2,
      color: 'from-primary-400 to-primary-600',
      trend: '+3',
    },
    {
      label: '本周订单',
      value: totalOrders,
      icon: Package,
      color: 'from-secondary-400 to-secondary-600',
      trend: '+12.5%',
    },
    {
      label: '总交易额',
      value: `¥${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      trend: '+8.3%',
    },
    {
      label: '平台收入',
      value: `¥${platformIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-amber-400 to-amber-600',
      trend: '+10.2%',
    },
  ];

  const filteredStores = mockStores.filter(
    (s) =>
      s.name.includes(searchText) || s.address.includes(searchText)
  );

  const renderStoresTab = () => (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索门店名称或地址..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-warm-50 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          新增门店
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                门店信息
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                营业时间
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                价格
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                评分
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                容量
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                状态
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStores.map((store) => (
              <tr key={store.id} className="hover:bg-warm-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={store.images[0]}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{store.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {store.address}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {store.businessHours}
                </td>
                <td className="px-6 py-4">
                  <span className="text-primary-600 font-medium">
                    {formatPrice(store.pricePerHour)}
                    <span className="text-xs text-gray-400 font-normal">/时</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-sm font-medium text-gray-700">
                      {store.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({store.reviewCount})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {store.capacity.small.total +
                    store.capacity.medium.total +
                    store.capacity.large.total}{' '}
                  格
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    营业中
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-secondary-500 hover:bg-secondary-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary-500" />
          基础定价规则
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">小型行李</span>
              <span className="text-primary-600 font-bold">¥7/时 起</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>日封顶：¥35</span>
              <span>尺寸：≤20寸</span>
            </div>
          </div>
          <div className="p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">中型行李</span>
              <span className="text-primary-600 font-bold">¥10/时 起</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>日封顶：¥50</span>
              <span>尺寸：20-24寸</span>
            </div>
          </div>
          <div className="p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700">大型行李</span>
              <span className="text-primary-600 font-bold">¥15/时 起</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>日封顶：¥75</span>
              <span>尺寸：≥28寸</span>
            </div>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors text-sm">
          编辑定价规则
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary-500" />
          节假日溢价
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700 text-sm">春节期间</p>
              <p className="text-xs text-gray-500">2026.02.10 - 2026.02.17</p>
            </div>
            <span className="text-amber-600 font-bold">+50%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700 text-sm">国庆假期</p>
              <p className="text-xs text-gray-500">2026.10.01 - 2026.10.07</p>
            </div>
            <span className="text-primary-600 font-bold">+30%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700 text-sm">周末溢价</p>
              <p className="text-xs text-gray-500">每周六、周日</p>
            </div>
            <span className="text-secondary-600 font-bold">+10%</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 bg-secondary-50 text-secondary-600 rounded-xl font-medium hover:bg-secondary-100 transition-colors text-sm">
          管理节假日规则
        </button>
      </div>
    </div>
  );

  const renderCapacityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-500" />
          柜位类型配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border-2 border-gray-100 rounded-2xl hover:border-primary-200 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800">小型柜</h4>
            <p className="text-sm text-gray-500 mt-1">40×30×50cm</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                单店标配：<span className="font-semibold">30格</span>
              </p>
            </div>
          </div>
          <div className="p-5 border-2 border-primary-200 rounded-2xl bg-primary-50/30">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <h4 className="font-semibold text-gray-800">中型柜</h4>
            <p className="text-sm text-gray-500 mt-1">55×40×70cm</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                单店标配：<span className="font-semibold">20格</span>
              </p>
            </div>
          </div>
          <div className="p-5 border-2 border-gray-100 rounded-2xl hover:border-primary-200 transition-colors">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-semibold text-gray-800">大型柜</h4>
            <p className="text-sm text-gray-500 mt-1">80×50×100cm</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                单店标配：<span className="font-semibold">10格</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary-500" />
            节假日容量调整
          </h3>
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
            + 添加配置
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">春运高峰期</p>
                <p className="text-sm text-gray-500">
                  2026.01.20 - 2026.02.28 · 北京站、西站、南站
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600">+50% 容量</p>
              <p className="text-xs text-gray-500">增加临时柜位</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">暑运期间</p>
                <p className="text-sm text-gray-500">
                  2026.07.01 - 2026.08.31 · 全部门店
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-amber-600">+30% 容量</p>
              <p className="text-xs text-gray-500">增加临时柜位</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettlementTab = () => (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索门店名称..."
              className="pl-9 pr-4 py-2.5 bg-warm-50 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2.5 bg-warm-50 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>全部状态</option>
              <option>待结算</option>
              <option>已结算</option>
            </select>
            <button className="px-4 py-2.5 bg-secondary-500 text-white rounded-xl text-sm font-medium hover:bg-secondary-600 transition-colors">
              导出报表
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                结算周期
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                门店
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                订单数
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                总金额
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                平台抽成 (20%)
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                门店收入
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                状态
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockSettlements.map((item) => (
              <tr key={item.id} className="hover:bg-warm-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700">
                    {item.period}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-800">{item.storeName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{item.orderCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-800">
                    {formatPrice(item.totalAmount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-amber-600 font-medium">
                    -{formatPrice(item.platformFee)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-green-600 font-semibold">
                    +{formatPrice(item.storeIncome)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'settled'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.status === 'settled' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {item.status === 'settled' ? '已结算' : '待结算'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                    查看明细
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">运营报表</h1>
          <p className="text-gray-500 text-sm mt-1">
            门店管理、价格规则、容量配置、结算明细
          </p>
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
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-3">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.value
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.value && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'stores' && renderStoresTab()}
      {activeTab === 'pricing' && renderPricingTab()}
      {activeTab === 'capacity' && renderCapacityTab()}
      {activeTab === 'settlement' && renderSettlementTab()}
    </div>
  );
};
