export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  heightInInches: number;
  widthInInches?: number;
  weightInKg?: number;
  material: string; // e.g. "100% Pure Natural River Clay", "Organic Terracotta"
  colour: string; // e.g. "Natural Clay", "Organic Turmeric Paint", "Gold Accent"
  stock: number;
  featured?: boolean;
  isFeatured?: boolean;
  trending?: boolean;
  isTrending?: boolean;
  isActive?: boolean;
  images: string[];
  rating?: number;
  reviewCount?: number;
  dissolvesInWaterMins?: number;
  hasSeeds?: boolean;
  dateAdded?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed?: number;
  isActive: boolean;
  isSingleUse?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  heightInInches?: number;
  material?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface OrderLocation {
  lat: number;
  lng: number;
  addressString?: string;
  googleMapsUrl: string;
  source?: 'default' | 'gps' | 'manual';
  accuracyMeters?: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  altPhone?: string;
  street: string;
  landmark: string;
  area: string;
  pincode: string;
  city: string; // Default Vijayawada
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  deliveryAddress: DeliveryAddress;
  location: OrderLocation;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: 'upi_qr' | 'cod';
  paymentId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerId: string;
  customerName: string;
  rating: number; // 1 to 5
  reviewText: string;
  images?: string[];
  isApproved: boolean;
  adminReply?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses?: (DeliveryAddress & { id: string; isDefault?: boolean })[];
  totalOrders?: number;
  totalSpent?: number;
  isBlocked?: boolean;
  joinedDate?: string;
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  googleMapsLink: string;
  upiId: string;
  upiPayeeName: string;
  businessHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  terms: string;
  privacyPolicy: string;
  refundPolicy: string;
  shippingPolicy: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  customerId: string;
  paymentReference?: string;
  paymentMethod: 'upi_qr';
  amount: number;
  status: 'captured' | 'failed' | 'pending' | 'refunded';
  date: string;
}

export type Payment = PaymentRecord;
