import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '../api/googleoauth'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiLock } from 'react-icons/fi'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
  </svg>
)

const Login = () => {
  const navigate = useNavigate();

  // Redirect to panel if already authenticated
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user-info');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed?.email === 'mrsujan321@gmail.com' && parsed?.token) {
        navigate('/admin/panel', { replace: true });
      }
    } catch {
      // ignore malformed storage
    }
  }, [navigate]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        const token = result.data.token;
        const obj = { email, name, image, token };
        localStorage.setItem("user-info", JSON.stringify(obj));
        navigate("/admin/panel");
        toast.success("Login successfully!");
      }
    } catch (error) {
      console.error("Error while requesting google code: ", error);
      toast.error("Login failed. Please try again.");
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-base py-12 px-6 relative overflow-hidden">

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#FFC107]/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#E53935]/[0.06] rounded-full blur-3xl" />
      </div>
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10
                      shadow-xl shadow-slate-200/60 text-center animate-fade-up">

        {/* Logo */}
        <div className="mb-8">
          <span className="text-2xl font-extrabold text-slate-900">
            Sujan<span className="text-gradient">ship</span>
          </span>

          {/* Lock badge */}
          <div className="flex items-center justify-center gap-2 mt-5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC107]/20 to-[#E53935]/20
                            border border-[#FFC107]/30 flex items-center justify-center">
              <FiLock size={16} className="text-[#D84315]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Admin Portal</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Sign in with your Google account to create, edit,<br className="hidden sm:block" /> and publish technical blog posts.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">continue with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          id="google-login-btn"
          onClick={googleLogin}
          className="w-full py-3.5 px-4 bg-white border-2 border-slate-200
                     hover:border-[#FFC107]/60 hover:bg-[#FFFDF9] hover:shadow-md
                     hover:shadow-slate-200/80 hover:-translate-y-0.5
                     text-slate-700 font-semibold rounded-xl transition-all duration-200
                     cursor-pointer flex items-center justify-center gap-3 shadow-sm"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>

        <p className="text-xs text-slate-400 mt-6">
          Only authorized accounts can access the admin panel.
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default Login;
