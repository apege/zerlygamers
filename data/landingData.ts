import { RobuxPackage, Testimonial, PaymentMethod } from '@/types/landing';

export const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: 1, amount: 80, priceFormatted: 'Rp 35.000', priceNumber: 35000 },
  { id: 2, amount: 160, priceFormatted: 'Rp 65.000', priceNumber: 65000 },
  { id: 3, amount: 240, priceFormatted: 'Rp 95.000', priceNumber: 95000, isBestSeller: true },
  { id: 4, amount: 400, priceFormatted: 'Rp 145.000', priceNumber: 145000 },
  { id: 5, amount: 800, priceFormatted: 'Rp 275.000', priceNumber: 275000 },
  { id: 6, amount: 1700, priceFormatted: 'Rp 550.000', priceNumber: 550000 },
];

export const ALL_ROBUX_PACKAGES: RobuxPackage[] = [
  ...ROBUX_PACKAGES,
  { id: 7, amount: 2000, priceFormatted: 'Rp 645.000', priceNumber: 645000 },
  { id: 8, amount: 4500, priceFormatted: 'Rp 1.420.000', priceNumber: 1420000 },
  { id: 9, amount: 10000, priceFormatted: 'Rp 3.100.000', priceNumber: 3100000 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    username: '@GamerKeren',
    avatar: '',
    text: 'Top up di Zerly Gamers selalu cepat & aman! Recommended banget! 💖',
    stars: 5,
  },
  {
    id: 2,
    username: '@RobloxQueen_ID',
    avatar: '',
    text: 'Robux langsung masuk kurang dari 2 menit! Admin ramah banget fast respon 🥰✨',
    stars: 5,
  },
  {
    id: 3,
    username: '@ProGamer2026',
    avatar: '',
    text: 'Harga termurah dibanding toko lain, udah langganan 1 tahun lebih no minus!',
    stars: 5,
  },
  {
    id: 4,
    username: '@AnyaCutePlays',
    avatar: '',
    text: 'Suka banget sama tampilannya gemes, proses order gampang dan sat-set!',
    stars: 5,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'DANA', color: 'bg-[#118EEA]', logo: '/payments/dana.png' },
  { name: 'OVO', color: 'bg-[#4C3494]', logo: '/payments/ovo.png' },
  { name: 'gopay', color: 'bg-[#00AED6]', logo: '/payments/gopay.png' },
  { name: 'QRIS', color: 'bg-[#1E293B]', logo: '/payments/qris.png' },
  { name: 'ShopeePay', color: 'bg-[#EE4D2D]', logo: '/payments/shopeepay.png' },
  { name: 'BCA', color: 'bg-[#003882]', logo: '/payments/bca.png' },
  { name: 'mandiri', color: 'bg-[#002D62]', logo: '/payments/mandiri.png' },
  { name: 'BNI', color: 'bg-[#005E6A]', logo: '/payments/bni.png' },
  { name: 'BRI', color: 'bg-[#00529C]', logo: '/payments/bri.png' },
];

export const AVAILABLE_GAMES = [
  { id: 'roblox', name: 'Roblox - Robux' },
  { id: 'mlbb', name: 'Mobile Legends - Diamonds' },
  { id: 'ff', name: 'Free Fire - Diamonds' },
  { id: 'valorant', name: 'Valorant - Points' },
  { id: 'genshin', name: 'Genshin Impact - Genesis' },
];
