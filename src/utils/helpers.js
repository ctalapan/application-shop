import { COLORS } from './constants';

/**
 * Format price with Chinese currency symbol
 * @param {number} price
 * @param {string} unit
 */
export function formatPrice(price, unit = '') {
  if (price >= 10000) {
    return `¥${(price / 10000).toFixed(1)}万${unit ? '/' + unit : ''}`;
  }
  return `¥${price.toLocaleString('zh-CN')}${unit ? '/' + unit : ''}`;
}

/**
 * Format price always as full number
 */
export function formatPriceFull(price) {
  return `¥${price.toLocaleString('zh-CN')}`;
}

/**
 * Format date string to localized YYYY-MM-DD format using UTC to avoid timezone shifts
 */
export function formatDate(dateStr) {
  if (!dateStr) {
    return '';
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return dateStr;
  }
  return d.toISOString().split('T')[0];
}

/**
 * Get order status color
 */
export function getStatusColor(status) {
  const colorMap = {
    pending: COLORS.warning,
    processing: COLORS.primary,
    shipped: '#722ED1',
    completed: COLORS.success,
    cancelled: COLORS.danger,
  };
  return colorMap[status] || COLORS.textSecondary;
}

/**
 * Get order status label
 */
export function getStatusLabel(status) {
  const labelMap = {
    pending: '待确认',
    processing: '处理中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  };
  return labelMap[status] || status;
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status) {
  const map = {
    paid: '已付款',
    unpaid: '待付款',
    refunded: '已退款',
  };
  return map[status] || status;
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(method) {
  const map = {
    bank_transfer: '银行转账',
    alipay: '支付宝',
    wechat: '微信支付',
  };
  return map[method] || method;
}

/**
 * Calculate total price for an array of items
 */
export function calcTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

/**
 * Filter and sort products based on filter params
 */
export function filterProducts(products, filters) {
  let result = [...products];

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.brand.toLowerCase().includes(kw) ||
        p.supplierName.toLowerCase().includes(kw),
    );
  }
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.brand && filters.brand !== 'all') {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.region && filters.region !== 'all') {
    result = result.filter((p) => p.region === filters.region);
  }
  if (filters.minPrice != null && filters.minPrice !== '') {
    result = result.filter((p) => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice != null && filters.maxPrice !== '') {
    result = result.filter((p) => p.price <= Number(filters.maxPrice));
  }
  if (filters.minOrder != null && filters.minOrder !== '') {
    result = result.filter((p) => p.minOrder <= Number(filters.minOrder));
  }

  switch (filters.sort) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'sales':
      result.sort((a, b) => b.sales - a.sales);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return result;
}

/**
 * Format badge count (e.g., 99+ for large numbers)
 */
export function formatBadgeCount(count) {
  if (count <= 0) {
    return null;
  }
  return count > 99 ? '99+' : String(count);
}

export function truncate(str, max = 30) {
  if (!str) {
    return '';
  }
  return str.length > max ? str.slice(0, max) + '…' : str;
}
