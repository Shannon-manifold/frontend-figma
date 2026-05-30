import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { questionService } from '../services/questionService';

export function QnAWritePage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    tagsString: ''
  });
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login?redirect=/qna/write');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrorMessage('질문 제목을 입력해주세요.');
      return;
    }
    if (!form.description.trim()) {
      setErrorMessage('한 줄 요약을 입력해주세요.');
      return;
    }
    if (!form.content.trim()) {
      setErrorMessage('질문 내용을 입력해주세요.');
      return;
    }

    setPublishing(true);
    setErrorMessage('');

    // Parse tag string
    const tags = form.tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const newQuestion = await questionService.createQuestion({
        title: form.title,
        description: form.description,
        content: form.content,
        tags: tags
      });
      // Redirect to Q&A details
      navigate(`/qna/${newQuestion.id}`);
    } catch (error: any) {
      console.error('Failed to create question:', error);
      setErrorMessage(error.message || '질문 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/qna" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          질문 목록으로 돌아가기
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/20">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              새로운 질문 등록하기
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              수학 정리나 증명 보조기(Lean 4, Coq 등) 사용에 대해 궁금한 점을 질문해 주세요.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                질문 제목
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="예: Lean 4에서 자연수 귀납법을 적용하는 최선의 방법은 무엇인가요?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                한 줄 요약
              </label>
              <input
                type="text"
                id="description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="질문의 핵심 요점을 간단히 요약해 주세요."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                id="tags"
                value={form.tagsString}
                onChange={e => setForm({ ...form, tagsString: e.target.value })}
                placeholder="예: Lean4, Induction, NumberTheory"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                태그를 입력하면 다른 사용자가 당신의 질문을 쉽게 검색하고 발견할 수 있습니다.
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                질문 내용
              </label>
              <textarea
                id="content"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="질문 내용을 자세하게 적어주세요. 해결하고 싶은 오류 메시지나 코드를 포함하면 더 유익한 답변을 얻을 수 있습니다."
                rows={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/qna"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={publishing}
                className="flex items-center justify-center min-w-[100px] px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors shadow-sm"
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : '질문 등록'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
