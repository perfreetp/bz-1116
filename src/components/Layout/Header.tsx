import { Link, useLocation } from 'react-router-dom';
import { Package, MapPin, ShoppingCart, ClipboardList, QrCode, Store, Headphones, BarChart3, User } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { UserRole } from '@/types';

const navItems: Record<UserRole, { label: string; path: string; icon: typeof Package }[]> = {
  visitor: [
    { label: '寄存点', path: '/', icon: Package },
    { label: '地图找店', path: '/map', icon: MapPin },
    { label: '我的订单', path: '/orders', icon: ClipboardList },
    { label: '取件核验', path: '/pickup', icon: QrCode },
  ],
  store: [
    { label: '门店工作台', path: '/store/workbench', icon: Store },
    { label: '取件核验', path: '/pickup', icon: QrCode },
  ],
  service: [
    { label: '客服处理', path: '/service', icon: Headphones },
  ],
  admin: [
    { label: '运营报表', path: '/admin', icon: BarChart3 },
  ],
};

const roles: { value: UserRole; label: string }[] = [
  { value: 'visitor', label: '游客端' },
  { value: 'store', label: '门店端' },
  { value: 'service', label: '客服端' },
  { value: 'admin', label: '运营端' },
];

export const Header = () => {
  const location = useLocation();
  const { currentRole, currentUser, setCurrentRole } = useUserStore();
  const items = navItems[currentRole];

  return (
    <header className="bg-white border-b border-warm-200 sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-orange-glow">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">行存存</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-warm-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-warm-50 rounded-lg p-1">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setCurrentRole(role.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    currentRole === role.value
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-warm-200">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
