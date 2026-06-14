import { Store, OrderItem, Insurance } from '@/types';

export const calculateBasePrice = (
  store: Store,
  startTime: string,
  endTime: string,
  items: OrderItem[]
): number => {
  const start = new Date(startTime.replace(' ', 'T')).getTime();
  const end = new Date(endTime.replace(' ', 'T')).getTime();
  const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
  const days = Math.ceil(hours / 24);

  let total = 0;
  items.forEach((item) => {
    const pricePerHour = getSizePrice(store.pricePerHour, item.size);
    const pricePerDay = getSizePrice(store.pricePerDay, item.size);

    if (hours <= 24) {
      total += Math.min(pricePerHour * hours, pricePerDay) * item.quantity;
    } else {
      const remainHours = hours % 24;
      const dayPrice = pricePerDay * days * item.quantity;
      const remainPrice = remainHours > 0
        ? Math.min(pricePerHour * remainHours, pricePerDay) * item.quantity
        : 0;
      total += dayPrice + remainPrice;
    }
  });

  return Math.round(total);
};

const getSizePrice = (basePrice: number, size: string): number => {
  const multipliers: Record<string, number> = {
    small: 0.7,
    medium: 1,
    large: 1.5,
  };
  return basePrice * (multipliers[size] || 1);
};

export const calculateInsurancePremium = (amount: number): number => {
  return Math.round(amount * 0.01);
};

export const calculateTotalPrice = (
  basePrice: number,
  insurance?: Insurance
): number => {
  return basePrice + (insurance?.premium || 0);
};
