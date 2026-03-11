import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { LoginResponseData } from '@/types/dto/auth.dto';

interface AuthState {
  authData: LoginResponseData | null;
  setAuthData: (data: LoginResponseData) => void;
  clearAuthData: () => void;
  getAuthData: () => LoginResponseData | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authData: null,
      
      setAuthData: (data: LoginResponseData) => {
        set({ authData: data });
      },
      
      clearAuthData: () => {
        set({ authData: null });
      },
      
      getAuthData: () => {
        return get().authData;
      },
    }),
    {
      name: 'binzo-admin-auth-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
