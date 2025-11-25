import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios'; // Import the real API instance

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tempGoogleToken: null, // Stores the ID token from the Login screen
      isLoading: false,
      error: null,

      // Action 1: Initial Google Login (just stores the token temporarily)
      googleAuthAction: async (googleToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/google-login', { token: googleToken });

          // CASE A: User Exists -> Log them in immediately
          if (res.data.is_new_user === false) {
             set({ 
                 token: res.data.access_token, 
                 user: res.data.user, 
                 tempGoogleToken: null, // Clear temp token, we are done
                 isLoading: false 
             });
             return { status: 'EXISTING_USER' };
          }

          // CASE B: User is New -> Save token and start Onboarding
          // We store the Google token temporarily so we can send it later with the profile data
          set({ tempGoogleToken: googleToken, isLoading: false });
          return { status: 'NEW_USER' }; 

        } catch (err) {
          console.error("Login Check Error:", err);
          set({ error: "Login Verification Failed", isLoading: false });
          throw err;
        }
      },

      // Action 2: Complete Signup with Profile Data
      completeGoogleSignup: async (profileData) => {
        set({ isLoading: true, error: null });
        const googleToken = get().tempGoogleToken;

        if (!googleToken) {
            set({ error: "Google session expired. Please login again.", isLoading: false });
            return;
        }
        
        try {
            // We send the token in TWO places to be safe (Header + Body)
            // Backend likely looks for 'Authorization: Bearer <token>' OR body['token']
            const res = await api.post('/auth/google-signup', 
                { 
                    ...profileData, 
                    token: googleToken  // Sending in body
                },
                {
                    headers: {
                        // Sending in header as Bearer token (Standard OAuth practice)
                        Authorization: `Bearer ${googleToken}`
                    }
                }
            );
            
            // Success! Save the app's internal JWT and user data
            set({ 
                token: res.data.access_token, 
                user: res.data.user || { ...profileData }, 
                tempGoogleToken: null, 
                isLoading: false 
            });
            return true;

        } catch (err) {
            // Extract the specific error message from FastAPI (response.data.detail)
            const errorMessage = err.response?.data?.detail || "Signup Failed";
            console.error("Backend Signup Error:", err.response?.data);
            
            set({ error: errorMessage, isLoading: false });
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