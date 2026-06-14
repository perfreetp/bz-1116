import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface UserState {
  currentUser: User | null;
  currentRole: UserRole;
  setCurrentUser: (user: User | null) => void;
  setCurrentRole: (role: UserRole) => void;
}

const mockVisitor: User = {
  id: 'u001',
  name: '游客小明',
  role: 'visitor',
  phone: '138****8001',
};

const mockStoreUser: User = {
  id: 'u002',
  name: '北京站店店长',
  role: 'store',
  phone: '010-12345678',
  storeId: 's001',
};

const mockServiceUser: User = {
  id: 'u003',
  name: '客服小王',
  role: 'service',
  phone: '400-888-8888',
};

const mockAdminUser: User = {
  id: 'u004',
  name: '运营管理员',
  role: 'admin',
  phone: '400-999-9999',
};

export const useUserStore = create<UserState>((set) => ({
  currentUser: mockVisitor,
  currentRole: 'visitor',

  setCurrentUser: (user) => set({ currentUser: user }),

  setCurrentRole: (role) => {
    let user: User | null = null;
    switch (role) {
      case 'visitor':
        user = mockVisitor;
        break;
      case 'store':
        user = mockStoreUser;
        break;
      case 'service':
        user = mockServiceUser;
        break;
      case 'admin':
        user = mockAdminUser;
        break;
    }
    set({ currentRole: role, currentUser: user });
  },
}));
