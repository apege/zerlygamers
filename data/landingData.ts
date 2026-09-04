import { RobuxPackage, Testimonial, PaymentMethod } from '@/types/landing';

export const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: 10, amount: 1800, priceFormatted: 'Rp 35.000', priceNumber: 35000 },
  { id: 11, amount: 2200, priceFormatted: 'Rp 45.000', priceNumber: 45000, isBestSeller: true },
  { id: 12, amount: 2700, priceFormatted: 'Rp 50.000', priceNumber: 50000 },
  { id: 13, amount: 3200, priceFormatted: 'Rp 60.000', priceNumber: 60000 },
  { id: 14, amount: 3700, priceFormatted: 'Rp 70.000', priceNumber: 70000 },
  { id: 15, amount: 4300, priceFormatted: 'Rp 90.000', priceNumber: 90000 },
];

export const ALL_ROBUX_PACKAGES: RobuxPackage[] = [
  ...ROBUX_PACKAGES,
  { id: 16, amount: 5500, priceFormatted: 'Rp 100.000', priceNumber: 100000 },
  { id: 17, amount: 11500, priceFormatted: 'Rp 200.000', priceNumber: 200000 },
  { id: 18, amount: 10500, priceFormatted: 'Rp 300.000', priceNumber: 300000 },
  { id: 19, amount: 20500, priceFormatted: 'Rp 400.000', priceNumber: 400000 },
  { id: 20, amount: 30500, priceFormatted: 'Rp 500.000', priceNumber: 500000 },
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
