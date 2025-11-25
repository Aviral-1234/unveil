import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tempGoogleToken: null, // Stores token while user creates profile
      isLoading: false,
      error: null,

      // 1. Google Login / Check
      googleAuthAction: async (googleToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/google-login', { token: googleToken });
          
          if (res.data.is_new_user) {
            // User needs to create a profile. Save token and return status.
            set({ tempGoogleToken: googleToken, isLoading: false });
            return { status: 'NEW_USER' }; 
          } else {
            // User exists, log them in
            set({ 
              token: res.data.access_token, 
              user: { email: res.data.email }, // Add more user details if available
              tempGoogleToken: null,
              isLoading: false 
            });
            return { status: 'LOGGED_IN' };
          }
        } catch (err) {
          set({ error: "Google Auth Failed", isLoading: false });
          throw err;
        }
      },

      // 2. Finalize Google Signup (Submit Profile)
      completeGoogleSignup: async (profileData) => {
        set({ isLoading: true, error: null });
        const token = get().tempGoogleToken;
        
        if (!token) throw new Error("No Google token found. Please sign in again.");

        try {
            // Combine token with profile data
            const payload = { ...profileData, token };
            const res = await api.post('/auth/google-signup', payload);
            
            set({ 
                token: res.data.access_token, 
                user: { ...profileData }, 
                tempGoogleToken: null, 
                isLoading: false 
            });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.detail || "Signup Failed", isLoading: false });
            throw err;
        }
      },

      logout: () => set({ user: null, token: null, tempGoogleToken: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;