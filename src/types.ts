export type UserRole = 'user' | 'seller' | 'admin' | 'super_admin';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  status?: 'active' | 'banned';
  isVerified?: boolean;
  location?: string;
  balance?: number;
  createdAt: string;
}

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: 'Stripe' | 'PayPal' | 'Bank Transfer';
  type: 'premium_ad' | 'wallet_topup';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Review {
  id: string;
  targetId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  type: 'ad' | 'user' | 'other';
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface WebsiteSettings {
  id: string;
  websiteName: string;
  logoUrl: string;
  emailSettings: any;
  seoSettings: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
