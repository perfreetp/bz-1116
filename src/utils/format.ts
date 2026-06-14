export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(0)}`;
};

export const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  if (distance < 1000) return `${distance}m`;
  return `${(distance / 1000).toFixed(1)}km`;
};

export const formatDate = (dateStr: string): string => {
  return dateStr;
};

export const formatDuration = (start: string, end: string): string => {
  const startTime = new Date(start.replace(' ', 'T')).getTime();
  const endTime = new Date(end.replace(' ', 'T')).getTime();
  const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
  if (hours < 24) return `${hours}小时`;
  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;
  return remainHours > 0 ? `${days}天${remainHours}小时` : `${days}天`;
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待入库',
    stored: '寄存中',
    extended: '已续存',
    overdue: '已超时',
    completed: '已完成',
    cancelled: '已取消',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    stored: 'bg-teal-100 text-teal-700',
    extended: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-500';
};

export const getSizeText = (size: string): string => {
  const sizeMap: Record<string, string> = {
    small: '小型',
    medium: '中型',
    large: '大型',
  };
  return sizeMap[size] || size;
};

export const getTicketTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    cancel: '取消申请',
    lost: '遗失申报',
    compensation: '赔付申请',
    complaint: '差评回访',
  };
  return typeMap[type] || type;
};

export const getTicketStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭',
  };
  return statusMap[status] || status;
};

export const generatePickupCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generateOrderId = (): string => {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD${timestamp}${random}`;
};
