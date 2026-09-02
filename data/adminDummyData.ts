// Type definitions for Zerly Gamers real database entities

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  username: string;
  robloxUserId?: string;
  whatsappNumber?: string;
  game: string;
  item: string;
  amount: number;
  price: number;
  priceFormatted: string;
  paymentMethod: string;
  orderChannel: 'WHATSAPP' | 'WEBSITE' | 'QRIS';
  status: 'masuk' | 'diproses' | 'selesai' | 'dibatalkan';
  statusLabel: string;
  createdAt: string;
  fullDateString: string;
  robloxIdStatus: 'aktif' | 'belum_aktif' | 'terverifikasi';
  customerNote?: string;
  adminNote?: string;
}

export interface AdminPricelistItem {
  id: string;
  amount: number;
  name: string;
  price: number;
  priceFormatted: string;
  status: 'aktif' | 'nonaktif';
  badge?: 'POPULER' | 'PROMO' | 'SULTAN';
}

export interface AdminCustomer {
  id: string;
  username: string;
  robloxUserId?: string;
  whatsappNumber?: string;
  totalOrders: number;
  totalSpent: string;
  status: 'aktif' | 'blacklist';
  blacklistReason?: string;
}

export interface AdminTestimonial {
  id: string;
  username: string;
  rating: number;
  timeAgo: string;
  itemPackage: string;
  comment: string;
  isVerified: boolean;
  status: 'tampil' | 'sembunyi';
  adminReply?: string;
}

export interface AdminPaymentMutation {
  id: string;
  orderNumber: string;
  username: string;
  channel: 'WEBSITE' | 'WHATSAPP';
  paymentMethod: string;
  date: string;
  amount: number;
  amountFormatted: string;
  robuxItem: string;
  status: 'LUNAS';
}

export interface AdminPaymentSummary {
  totalTransactions: number;
  totalRevenue: number;
  totalRevenueFormatted: string;
  totalRobuxSold: number;
  aov: number;
  aovFormatted: string;
  websiteRevenue: number;
  websiteRevenueFormatted: string;
  websiteCount: number;
  websitePercentage: string;
  whatsappRevenue: number;
  whatsappRevenueFormatted: string;
  whatsappCount: number;
  whatsappPercentage: string;
}
