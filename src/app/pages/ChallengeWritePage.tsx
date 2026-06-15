import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles, Plus, Trash2 } from 'lucide-react';
import { authService } from '../services/authService';
import { challengeService } from '../services/challengeService';

const DIFFICULTIES = ['Millennium', 'Hard', 'Medium'] as const;

const ACCENTS = [
  { label: '인디고', value: 'from-indigo-400 to-blue-600' },
  { label: '에메랄드', value: 'from-emerald-400 to-teal-600' },
  { label: '시안', value: 'from-cyan-400 to-sky-600' },
  { label: '푸시아', value: 'from-fuchsia-400 to-rose-600' },
  { label: '오렌지', value: 'from-orange-400 to-red-600' },
  { label: '바이올렛', value: 'from-violet-400 to-purple-600' },
];

export function ChallengeWritePage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState({
    title: '',
    field: '',
    description: '',
    detailedDescription: '',
    prize: '',
    sponsorPool: '',
    progress: 0,
    difficulty: 'Hard' as (typeof DIFFICULTIES)[number],
    proofSystem: '',
    accent: ACCENTS[0].value,
  });
  const [references, setReferences] = useState<{ title: string; url: string }[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login?redirect=/challenges/write');
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const addReference = () => setReferences([...references, { title: '', url: '' }]);
  const removeReference = (index: number) =>
    setReferences(references.filter((_, i) => i !== index));
  const updateReference = (index: number, key: 'title' | 'url', value: string) =>
    setReferences(references.map((ref, i) => (i === index ? { ...ref, [key]: value } : ref)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage('난제 제목을 입력해주세요.');
      return;
    }
    if (!form.field.trim()) {
      setErrorMessage('분야를 입력해주세요.');
      return;
    }
    if (!form.description.trim()) {
      setErrorMessage('한 줄 요약을 입력해주세요.');
      return;
    }

    setPublishing(true);
    setErrorMessage('');

    const validReferences = references
      .map((ref) => ({ title: ref.title.trim(), url: ref.url.trim() }))
      .filter((ref) => ref.title.length > 0 && ref.url.length > 0);

    try {
      const newChallenge = await challengeService.createChallenge({
        title: form.title.trim(),
        field: form.field.trim(),
        description: form.description.trim(),
        detailedDescription: form.detailedDescription.trim(),
        prize: form.prize.trim(),
        sponsorPool: form.sponsorPool.trim(),
        progress: Number(form.progress) || 0,
        difficulty: form.difficulty,
        proofSystem: form.proofSystem.trim(),
        accent: form.accent,
        references: validReferences,
      });
      // 등록 후 난제 목록으로 이동
      navigate('/challenges', { state: { createdId: newChallenge.id } });
    } catch (error: any) {
      console.error('Failed to create challenge:', error);
      setErrorMessage(error.message || '난제 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setPublishing(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all';
  const labelClass =
    'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/challenges"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          난제 목록으로 돌아가기
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/20">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              새로운 난제 등록하기
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              형식 증명 커뮤니티가 함께 추적할 미해결 난제를 등록해 주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="title" className={labelClass}>
                난제 제목
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예: 리만 가설"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="field" className={labelClass}>
                  분야
                </label>
                <input
                  type="text"
                  id="field"
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  placeholder="예: 해석적 정수론"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="proofSystem" className={labelClass}>
                  증명 보조기
                </label>
                <input
                  type="text"
                  id="proofSystem"
                  value={form.proofSystem}
                  onChange={(e) => setForm({ ...form, proofSystem: e.target.value })}
                  placeholder="예: Lean 4"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                한 줄 요약
              </label>
              <input
                type="text"
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="난제의 핵심을 한 문장으로 요약해 주세요."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="detailedDescription" className={labelClass}>
                상세 설명
              </label>
              <textarea
                id="detailedDescription"
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                placeholder="난제의 배경, 정의, 검증 조건 등을 자세히 설명해 주세요."
                rows={8}
                className={`${inputClass} resize-none font-sans`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prize" className={labelClass}>
                  해결 상금
                </label>
                <input
                  type="text"
                  id="prize"
                  value={form.prize}
                  onChange={(e) => setForm({ ...form, prize: e.target.value })}
                  placeholder="예: $1,000,000"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="sponsorPool" className={labelClass}>
                  후원 풀 적립액
                </label>
                <input
                  type="text"
                  id="sponsorPool"
                  value={form.sponsorPool}
                  onChange={(e) => setForm({ ...form, sponsorPool: e.target.value })}
                  placeholder="예: $0"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="difficulty" className={labelClass}>
                  난이도
                </label>
                <select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value as (typeof DIFFICULTIES)[number] })
                  }
                  className={inputClass}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="progress" className={labelClass}>
                  진행률 (%)
                </label>
                <input
                  type="number"
                  id="progress"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="accent" className={labelClass}>
                  강조 색상
                </label>
                <select
                  id="accent"
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  className={inputClass}
                >
                  {ACCENTS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} mb-0`}>참고 자료 (선택)</label>
                <button
                  type="button"
                  onClick={addReference}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  추가
                </button>
              </div>
              <div className="space-y-2">
                {references.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ref.title}
                      onChange={(e) => updateReference(index, 'title', e.target.value)}
                      placeholder="제목"
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="url"
                      value={ref.url}
                      onChange={(e) => updateReference(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="참고 자료 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/challenges"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={publishing}
                className="flex items-center justify-center min-w-[100px] px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors shadow-sm"
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : '난제 등록'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
