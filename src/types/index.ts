// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'member';

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanType;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise';

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common Types
export interface SelectOption {
  label: string;
  value: string;
}
