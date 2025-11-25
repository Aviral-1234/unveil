import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { googleAuthAction, error } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleAuthAction(credentialResponse.credential);
      if (result.status === 'NEW_USER') {
        navigate('/onboarding'); // Go to profile creation
      } else {
        navigate('/feed'); // Go to app
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Blobs (The "Aura" effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse delay-1000"></div>

      {/* Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-gradient-to-tr from-orange-500 to-pink-500 p-4 rounded-full mb-4 shadow-lg shadow-orange-500/30">
            <Flame className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Blind Connect
          </h1>
          <p className="text-gray-300 mt-2 text-sm font-medium">No superficial swiping. Just pure vibe.</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
            </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center transform transition hover:scale-105 duration-200">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="300"
              text="continue_with"
            />
          </div>
          
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">Or stay boring</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <p className="text-xs text-gray-500">
            By clicking continue, you agree to pass the Vibe Check. 
            <br/> Bots will be roasted.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;