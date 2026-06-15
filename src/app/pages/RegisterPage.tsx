import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Eye, EyeOff, Check, ChevronDown, RefreshCw, Copy, CheckCheck } from 'lucide-react';
import { authService } from '../services/authService';

const PROOF_SYSTEMS = ['Lean 4', 'Coq', 'Isabelle', 'Agda', '아직 모름'];

const CHARSET = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digit: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function generateSecurePassword(length = 16): string {
  const all = CHARSET.lower + CHARSET.upper + CHARSET.digit + CHARSET.symbol;
  const required = [
    CHARSET.lower[randomIndex(CHARSET.lower.length)],
    CHARSET.upper[randomIndex(CHARSET.upper.length)],
    CHARSET.digit[randomIndex(CHARSET.digit.length)],
    CHARSET.symbol[randomIndex(CHARSET.symbol.length)],
  ];
  const rest = Array.from({ length: length - 4 }, () => all[randomIndex(all.length)]);
  const combined = [...required, ...rest];
  // Fisher-Yates shuffle using crypto
  for (let i = combined.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join('');
}

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    system: '',
    agree: false,
  });
  const [step, setStep] = useState<'form' | 'done'>('form');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', '약함', '보통', '강함', '매우 강함'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  const passwordMatch = form.confirm && form.password === form.confirm;
  const canSubmit =
    form.name && form.email && form.password && passwordMatch && form.system && form.agree;

  const handleGenerate = () => {
    const pwd = generateSecurePassword(16);
    setForm((f) => ({ ...f, password: pwd, confirm: pwd }));
    setShowPassword(true);
    setShowConfirm(true);
  };

  const handleCopy = () => {
    if (!form.password) return;
    navigator.clipboard.writeText(form.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        nickname: form.name,
        email: form.email,
        password: form.password,
      });
      setStep('done');
    } catch (error: any) {
      console.error('Failed to register:', error);
      alert(error.message || '회원가입에 실패했습니다.');
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
              거인의 어깨에 올라서서<br />더 넓은 세상을 바라보라.
            </p>
            <footer className="text-gray-400 text-sm">— 아이작 뉴턴</footer>
          </blockquote>

          <div className="space-y-4 text-sm">
            {[
              '기계 검증된 수학 증명을 공유하세요',
              'Lean, Coq, Isabelle, Agda 증명을 제출하세요',
              '전 세계 수학자들과 함께 난제에 도전하세요',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-indigo-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">© 2026 ShannonManifold</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center text-sm font-bold text-white">∀</div>
            <span className="font-semibold text-sm text-gray-900">ShannonManifold</span>
          </Link>

          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-1">회원가입</h1>
                <p className="text-sm text-gray-500 mb-8">
                  이미 계정이 있으신가요?{' '}
                  <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    로그인
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                    <input
                      type="text" required placeholder="홍길동"
                      value={form.name} onChange={set('name')}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
                    <input
                      type="email" required placeholder="you@example.com"
                      value={form.email} onChange={set('email')}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">비밀번호</label>
                      <div className="flex items-center gap-1">
                        <AnimatePresence mode="wait">
                          {form.password && (
                            <motion.button
                              key="copy"
                              type="button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                              onClick={handleCopy}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1.5 py-0.5 rounded"
                            >
                              {copied ? (
                                <><CheckCheck className="w-3 h-3 text-green-500" /><span className="text-green-600">복사됨</span></>
                              ) : (
                                <><Copy className="w-3 h-3" />복사</>
                              )}
                            </motion.button>
                          )}
                        </AnimatePresence>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleGenerate}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors px-1.5 py-0.5 rounded hover:bg-indigo-50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          자동 생성
                        </motion.button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                        value={form.password} onChange={set('password')}
                        className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* 강도 바 */}
                    {form.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className={`text-xs ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-600' : passwordStrength === 3 ? 'text-blue-600' : 'text-green-600'}`}>
                          {strengthLabel[passwordStrength]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'} required placeholder="••••••••"
                        value={form.confirm} onChange={set('confirm')}
                        className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          form.confirm
                            ? passwordMatch
                              ? 'border-green-400 focus:ring-green-400'
                              : 'border-red-400 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.confirm && (
                      <p className={`text-xs mt-1 ${passwordMatch ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                      </p>
                    )}
                  </div>

                  {/* 증명 보조기 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">선호 증명 보조기</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSystemOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                      >
                        <span className={form.system ? 'text-gray-900' : 'text-gray-400'}>
                          {form.system || '선택하세요'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${systemOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {systemOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                          >
                            {PROOF_SYSTEMS.map((s) => (
                              <button
                                key={s} type="button"
                                onClick={() => { setForm((f) => ({ ...f, system: s })); setSystemOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${form.system === s ? 'text-indigo-700 font-medium bg-indigo-50/50' : 'text-gray-700'}`}
                              >
                                {s}
                                {form.system === s && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 동의 */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input type="checkbox" className="sr-only" checked={form.agree}
                        onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))} />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${form.agree ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                        {form.agree && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <Link to="/terms" target="_blank" className="text-indigo-600 hover:underline">이용약관</Link> 및{' '}
                      <Link to="/privacy" target="_blank" className="text-indigo-600 hover:underline">개인정보 처리방침</Link>에 동의합니다
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ scale: canSubmit ? 1.01 : 1 }}
                    whileTap={{ scale: canSubmit ? 0.99 : 1 }}
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        가입 중...
                      </>
                    ) : '가입하기'}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* 완료 화면 */
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">가입 완료!</h2>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-800">{form.email}</span>로
                </p>
                <p className="text-sm text-gray-500 mb-8">이메일 인증 링크를 보냈습니다.</p>
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    로그인하러 가기
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
