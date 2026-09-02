export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  username: string;
  robloxUserId?: string;
  whatsappNumber?: string;
  game: string;
  item: string;
  amount: number;
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
  badge?: 'PROMO' | 'SULTAN' | 'BEST SELLER';
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

export const DUMMY_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1',
    orderNumber: '#BLX86344363',
    customerName: 'Rara Notara',
    username: '@Raraa_notara',
    robloxUserId: '10602019684',
    whatsappNumber: '+6285828378025',
    game: 'Roblox',
    item: '2.200 Robux',
    amount: 2200,
    priceFormatted: 'Rp 45.000',
    paymentMethod: 'WHATSAPP DIRECT',
    orderChannel: 'WHATSAPP',
    status: 'masuk',
    statusLabel: 'Menunggu Pembayaran',
    createdAt: '2 Sep, 18.51',
    fullDateString: '2 September 2026 pukul 18.51 WIB',
    robloxIdStatus: 'belum_aktif',
    customerNote: 'Pemesanan via WhatsApp Direct',
    adminNote: '',
  },
  {
    id: 'ord-2',
    orderNumber: '#BLX86087267',
    customerName: 'Rara Notara',
    username: '@Raraa_notara',
    robloxUserId: '10602019684',
    whatsappNumber: '+6285828378025',
    game: 'Roblox',
    item: '2.200 Robux',
    amount: 2200,
    priceFormatted: 'Rp 45.000',
    paymentMethod: 'WHATSAPP DIRECT',
    orderChannel: 'WHATSAPP',
    status: 'masuk',
    statusLabel: 'Menunggu Pembayaran',
    createdAt: '2 Sep, 18.51',
    fullDateString: '2 September 2026 pukul 18.51 WIB',
    robloxIdStatus: 'belum_aktif',
    customerNote: 'Pemesanan via WhatsApp Direct',
    adminNote: '',
  },
  {
    id: 'ord-3',
    orderNumber: '#BLX72431558',
    customerName: 'Kaisha Putri',
    username: '@Kaisha2612',
    robloxUserId: '58291048291',
    whatsappNumber: '+6281299887766',
    game: 'Roblox',
    item: '1.800 Robux',
    amount: 1800,
    priceFormatted: 'Rp 35.000',
    paymentMethod: 'WEBSITE INSTANT',
    orderChannel: 'WEBSITE',
    status: 'masuk',
    statusLabel: 'Menunggu Pembayaran',
    createdAt: '2 Sep, 18.32',
    fullDateString: '2 September 2026 pukul 18.32 WIB',
    robloxIdStatus: 'aktif',
    customerNote: 'Mohon segera diproses ya kak',
    adminNote: '',
  },
  {
    id: 'ord-4',
    orderNumber: '#BLX13579622',
    customerName: 'Yaya Aja',
    username: '@yaa_aja17',
    robloxUserId: '82910492810',
    whatsappNumber: '+6287811223344',
    game: 'Roblox',
    item: '2.200 Robux',
    amount: 2200,
    priceFormatted: 'Rp 45.000',
    paymentMethod: 'WEBSITE INSTANT',
    orderChannel: 'WEBSITE',
    status: 'masuk',
    statusLabel: 'Menunggu Pembayaran',
    createdAt: '2 Sep, 18.05',
    fullDateString: '2 September 2026 pukul 18.05 WIB',
    robloxIdStatus: 'aktif',
    customerNote: '',
    adminNote: '',
  },
  {
    id: 'ord-5',
    orderNumber: '#BLX48563176',
    customerName: 'Crasiel Gamer',
    username: '@crasiel',
    robloxUserId: '49201928374',
    whatsappNumber: '+6285677889900',
    game: 'Roblox',
    item: '2.200 Robux',
    amount: 2200,
    priceFormatted: 'Rp 45.000',
    paymentMethod: 'WEBSITE INSTANT',
    orderChannel: 'WEBSITE',
    status: 'masuk',
    statusLabel: 'Menunggu Pembayaran',
    createdAt: '2 Sep, 17.04',
    fullDateString: '2 September 2026 pukul 17.04 WIB',
    robloxIdStatus: 'aktif',
    customerNote: 'Gamepass sudah dibuat harga 2200',
    adminNote: '',
  },
  {
    id: 'ord-6',
    orderNumber: '#BLX39201948',
    customerName: 'Cindy Claudia',
    username: '@PinkQueen_23',
    robloxUserId: '30291029384',
    whatsappNumber: '+6281298765432',
    game: 'Roblox',
    item: '3.200 Robux',
    amount: 3200,
    priceFormatted: 'Rp 60.000',
    paymentMethod: 'QRIS',
    orderChannel: 'WEBSITE',
    status: 'diproses',
    statusLabel: 'Sedang Diproses',
    createdAt: '2 Sep, 16.45',
    fullDateString: '2 September 2026 pukul 16.45 WIB',
    robloxIdStatus: 'aktif',
    customerNote: '',
    adminNote: 'Sedang proses transfer gift Robux',
  },
  {
    id: 'ord-7',
    orderNumber: '#BLX29384019',
    customerName: 'Farhan Bruh',
    username: '@bruh_36786',
    robloxUserId: '92039485721',
    whatsappNumber: '+6281399001122',
    game: 'Roblox',
    item: '2.700 Robux',
    amount: 2700,
    priceFormatted: 'Rp 50.000',
    paymentMethod: 'DANA',
    orderChannel: 'WHATSAPP',
    status: 'selesai',
    statusLabel: 'Transaksi Sukses',
    createdAt: '2 Sep, 15.20',
    fullDateString: '2 September 2026 pukul 15.20 WIB',
    robloxIdStatus: 'aktif',
    customerNote: '',
    adminNote: 'Robux sukses terkirim ke akun buyer',
  },
  {
    id: 'ord-8',
    orderNumber: '#BLX10293847',
    customerName: 'Saprianto',
    username: '@saprii09',
    robloxUserId: '19203948576',
    whatsappNumber: '+6289912345678',
    game: 'Roblox',
    item: '1.800 Robux',
    amount: 1800,
    priceFormatted: 'Rp 35.000',
    paymentMethod: 'BCA Transfer',
    orderChannel: 'WEBSITE',
    status: 'dibatalkan',
    statusLabel: 'Pesanan Dibatalkan',
    createdAt: '2 Sep, 14.10',
    fullDateString: '2 September 2026 pukul 14.10 WIB',
    robloxIdStatus: 'belum_aktif',
    customerNote: '',
    adminNote: 'Buyer membatalkan orderan',
  },
];

export const DUMMY_PRICELIST: AdminPricelistItem[] = [
  {
    id: 'pr-1',
    amount: 1800,
    name: '1.800 Robux',
    price: 35000,
    priceFormatted: 'Rp 35.000',
    status: 'aktif',
  },
  {
    id: 'pr-2',
    amount: 2200,
    name: '2.200 Robux',
    price: 45000,
    priceFormatted: 'Rp 45.000',
    status: 'aktif',
    badge: 'PROMO',
  },
  {
    id: 'pr-3',
    amount: 2700,
    name: '2.700 Robux',
    price: 50000,
    priceFormatted: 'Rp 50.000',
    status: 'aktif',
  },
  {
    id: 'pr-4',
    amount: 3200,
    name: '3.200 Robux',
    price: 60000,
    priceFormatted: 'Rp 60.000',
    status: 'aktif',
  },
  {
    id: 'pr-5',
    amount: 3700,
    name: '3.700 Robux',
    price: 70000,
    priceFormatted: 'Rp 70.000',
    status: 'aktif',
  },
  {
    id: 'pr-6',
    amount: 4200,
    name: '4.200 Robux',
    price: 80000,
    priceFormatted: 'Rp 80.000',
    status: 'aktif',
  },
  {
    id: 'pr-7',
    amount: 4700,
    name: '4.700 Robux',
    price: 90000,
    priceFormatted: 'Rp 90.000',
    status: 'aktif',
  },
  {
    id: 'pr-8',
    amount: 5500,
    name: '5.500 Robux',
    price: 100000,
    priceFormatted: 'Rp 100.000',
    status: 'aktif',
  },
  {
    id: 'pr-9',
    amount: 10500,
    name: '10.500 Robux',
    price: 200000,
    priceFormatted: 'Rp 200.000',
    status: 'aktif',
    badge: 'SULTAN',
  },
];

export const DUMMY_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'c-1',
    username: '@APG_Channel11',
    robloxUserId: '1350738735',
    whatsappNumber: '6287816959979',
    totalOrders: 15,
    totalSpent: 'Rp 1.937.000',
    status: 'aktif',
  },
  {
    id: 'c-2',
    username: '@XDolcx',
    robloxUserId: '1719331519',
    whatsappNumber: '6287816959979',
    totalOrders: 2,
    totalSpent: 'Rp 70.000',
    status: 'aktif',
  },
  {
    id: 'c-3',
    username: '@Luth_fiyya',
    robloxUserId: '4096014482',
    whatsappNumber: '62895412735876',
    totalOrders: 1,
    totalSpent: 'Rp 97.000',
    status: 'aktif',
  },
  {
    id: 'c-4',
    username: '@BloxyGamer99',
    robloxUserId: '',
    whatsappNumber: '',
    totalOrders: 1,
    totalSpent: 'Rp 45.000',
    status: 'aktif',
  },
  {
    id: 'c-5',
    username: '@KawaiiQueen_RBX',
    robloxUserId: '',
    whatsappNumber: '',
    totalOrders: 1,
    totalSpent: 'Rp 97.000',
    status: 'aktif',
  },
  {
    id: 'c-6',
    username: '@Perusuh',
    robloxUserId: '',
    whatsappNumber: '081234566789',
    totalOrders: 0,
    totalSpent: 'Rp 0',
    status: 'blacklist',
    blacklistReason: 'Indikasi penipuan atau penyalahgunaan',
  },
];

export const DUMMY_TESTIMONIALS: AdminTestimonial[] = [
  {
    id: 't-1',
    username: '@Londoireng61',
    rating: 4,
    timeAgo: 'Baru saja',
    itemPackage: '4.200 Robux',
    comment: 'Sedikit slowrespon ehee overall semuanya aman kok',
    isVerified: true,
    status: 'tampil',
    adminReply: '',
  },
  {
    id: 't-2',
    username: '@Crasiel17',
    rating: 5,
    timeAgo: 'Baru saja',
    itemPackage: '3.700 Robux',
    comment: 'Mantap banget langsung landing robuxnya cuma nunggu 2 menitan, recommended seller!',
    isVerified: true,
    status: 'tampil',
    adminReply: '',
  },
  {
    id: 't-3',
    username: '@APG_Channel11',
    rating: 5,
    timeAgo: '1 jam lalu',
    itemPackage: '10.500 Robux',
    comment: 'Langganan terus disini dari dulu gapernah ngecewain. Adminnya ramah dan fast respon!',
    isVerified: true,
    status: 'tampil',
    adminReply: 'Terima kasih banyak kak atas kepercayaannya selalu berbelanja di Zerly Gamers! ❤️',
  },
  {
    id: 't-4',
    username: '@Raraa_notara',
    rating: 5,
    timeAgo: '2 jam lalu',
    itemPackage: '2.200 Robux',
    comment: 'Harga paling murah dibanding toko lain, prosesnya kilat poll makasih min ✨',
    isVerified: true,
    status: 'tampil',
    adminReply: 'Sama-sama kak Rara, ditunggu next ordernya yaa! 🥰',
  },
  {
    id: 't-5',
    username: '@Kaisha2612',
    rating: 5,
    timeAgo: '3 jam lalu',
    itemPackage: '1.800 Robux',
    comment: 'Awalnya ragu tapi ternyata beneran aman 100% dan legal no minus minus.',
    isVerified: true,
    status: 'tampil',
    adminReply: '',
  },
  {
    id: 't-6',
    username: '@PinkQueen_23',
    rating: 5,
    timeAgo: '5 jam lalu',
    itemPackage: '3.200 Robux',
    comment: 'Proses gampang banget tinggal checkout langsung diurus adminnya, the best pokoknya!',
    isVerified: true,
    status: 'tampil',
    adminReply: '',
  },
];

export const DUMMY_PAYMENT_MUTATIONS: AdminPaymentMutation[] = [
  {
    id: 'pay-1',
    orderNumber: '#BLX24271763',
    username: '@Pghlfilms_Grant',
    channel: 'WEBSITE',
    paymentMethod: 'QRIS Instant',
    date: '2 Sep 2026',
    amount: 50000,
    amountFormatted: '+Rp 50.000',
    robuxItem: '2.700 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-2',
    orderNumber: '#BLX69263056',
    username: '@abstrak223',
    channel: 'WEBSITE',
    paymentMethod: 'BCA Transfer',
    date: '2 Sep 2026',
    amount: 45000,
    amountFormatted: '+Rp 45.000',
    robuxItem: '2.200 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-3',
    orderNumber: '#BLX89151263',
    username: '@Kaisha2612',
    channel: 'WEBSITE',
    paymentMethod: 'QRIS Instant',
    date: '2 Sep 2026',
    amount: 35000,
    amountFormatted: '+Rp 35.000',
    robuxItem: '1.800 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-4',
    orderNumber: '#BLX93530227',
    username: '@toberuutto',
    channel: 'WEBSITE',
    paymentMethod: 'DANA',
    date: '2 Sep 2026',
    amount: 35000,
    amountFormatted: '+Rp 35.000',
    robuxItem: '1.800 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-5',
    orderNumber: '#BLX02062682',
    username: '@Nhkfhkdmbkd?qq',
    channel: 'WEBSITE',
    paymentMethod: 'ShopeePay',
    date: '2 Sep 2026',
    amount: 45000,
    amountFormatted: '+Rp 45.000',
    robuxItem: '2.200 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-6',
    orderNumber: '#BLX86344363',
    username: '@Raraa_notara',
    channel: 'WHATSAPP',
    paymentMethod: 'WhatsApp Direct (BCA)',
    date: '2 Sep 2026',
    amount: 45000,
    amountFormatted: '+Rp 45.000',
    robuxItem: '2.200 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-7',
    orderNumber: '#BLX86087267',
    username: '@Raraa_notara',
    channel: 'WHATSAPP',
    paymentMethod: 'WhatsApp Direct (DANA)',
    date: '2 Sep 2026',
    amount: 45000,
    amountFormatted: '+Rp 45.000',
    robuxItem: '2.200 Robux',
    status: 'LUNAS',
  },
  {
    id: 'pay-8',
    orderNumber: '#BLX29384019',
    username: '@bruh_36786',
    channel: 'WHATSAPP',
    paymentMethod: 'WhatsApp Direct (GoPay)',
    date: '2 Sep 2026',
    amount: 50000,
    amountFormatted: '+Rp 50.000',
    robuxItem: '2.700 Robux',
    status: 'LUNAS',
  },
];
