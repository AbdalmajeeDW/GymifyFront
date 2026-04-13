// src/utils/api.ts
import { useAuth } from '@/hooks/useAuth';

// دالة لإنشاء طلبات API مع التوكن
export const createAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// دالة لطلب API محمي
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth-token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // إذا كان التوكن منتهي الصلاحية
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
};