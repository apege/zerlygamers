export interface RobuxPackage {
  id: number;
  amount: number;
  priceFormatted: string;
  priceNumber: number;
  isBestSeller?: boolean;
}

export interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Testimonial {
  id: number;
  username: string;
  avatar: string;
  text: string;
  stars: number;
}

export interface PaymentMethod {
  name: string;
  color: string;
  logo?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'shield' | 'zap' | 'award' | 'headphone' | 'wallet';
}
