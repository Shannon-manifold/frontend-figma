import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
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
