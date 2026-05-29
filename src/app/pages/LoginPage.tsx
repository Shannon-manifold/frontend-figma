import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Github } from 'lucide-react';
import { authService } from '../services/authService';


export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(form);
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/mypage';
      navigate(redirectUrl);
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-sm font-bold text-gray-900">∀</div>
          <span className="text-white font-semibold text-sm tracking-tight">ShannonManifold</span>
        </Link>

        <div>
          <blockquote className="border-l-2 border-indigo-400 pl-5 mb-8">
            <p className="text-2xl font-serif text-white leading-relaxed italic mb-4">
              수학의 본질은 그 자유로움에 있다.
            </p>
            <footer className="text-gray-400 text-sm">— 게오르크 칸토어</footer>
          </blockquote>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            {[
              { value: '1,247', label: '검증된 정리' },
              { value: '892', label: '기여자' },
              { value: '87.5%', label: '검증률' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">© 2026 ShannonManifold</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center text-sm font-bold text-white">∀</div>
            <span className="font-semibold text-sm text-gray-900">ShannonManifold</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">로그인</h1>
          <p className="text-sm text-gray-500 mb-8">커뮤니티에 오신 것을 환영합니다</p>

          {/* OAuth */}
          <div className="space-y-2 mb-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub으로 계속하기
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 계속하기
            </motion.button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">또는 이메일로</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  로그인 중...
                </>
              ) : '로그인'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
              회원가입
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
