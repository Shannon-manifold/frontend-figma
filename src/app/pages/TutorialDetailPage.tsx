import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
// @ts-ignore
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  X,
  Lightbulb,
  BookOpen,
  Home,
  CheckCircle,
  Loader2,
  Trophy,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { tutorialService } from '../services/tutorialService';
import { TutorialDetailResponse } from '../services/types';

export function TutorialDetailPage() {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState<TutorialDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981']
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 },
          colors: ['#a855f7', '#ec4899']
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 },
          colors: ['#6366f1', '#3b82f6']
        });
      }, 350);
    } catch (e) {
      console.error('Confetti animation failed:', e);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!tutorialId) return;
      setLoading(true);
      try {
        const data = await tutorialService.getTutorialDetail(Number(tutorialId));
        setTutorial(data);
      } catch (err) {
        console.error('Failed to fetch tutorial detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [tutorialId]);

  const step = tutorial?.steps && tutorial.steps.length > currentStep ? tutorial.steps[currentStep] : null;

  useEffect(() => {
    if (step) {
      setUserCode(step.starterCode || '');
      setIsCorrect(null);
      setErrorMessage('');
      setShowHint(false);
    }
  }, [currentStep, step]);

  const checkCode = async () => {
    if (!step || !tutorialId) return;
    
    setCompleting(true);
    setErrorMessage('');
    setIsCorrect(null);
    try {
      const result = await tutorialService.verifyStep(Number(tutorialId), step.id, userCode);
      if (result && result.verified) {
        setIsCorrect(true);
        await tutorialService.completeStep(Number(tutorialId), step.id);
        
        if (tutorial?.steps && currentStep === tutorial.steps.length - 1) {
          setTimeout(() => {
            setShowCompleteModal(true);
            triggerConfetti();
          }, 500);
        }
      } else {
        setIsCorrect(false);
        setErrorMessage(result?.output || 'Lean 검증에 실패했습니다. 코드를 다시 확인해주세요.');
      }
    } catch (err: any) {
      console.error('Failed to verify step:', err);
      setIsCorrect(false);
      setErrorMessage(err.message || '검증 서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setCompleting(false);
    }
  };

  const nextStep = () => {
    if (tutorial?.steps && currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!tutorial || !step) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center flex-col text-gray-400">
        <p className="mb-4">튜토리얼 정보를 불러올 수 없습니다.</p>
        <Link to="/tutorials" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/tutorials" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">튜토리얼 목록</span>
          </Link>
          <div className="h-4 w-px bg-gray-600"></div>
          <h1 className="text-white font-semibold">{tutorial.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {currentStep + 1} / {tutorial.steps.length}
          </div>
          <div className="flex gap-1">
            {tutorial.steps.map((_: any, index: number) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-indigo-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Instructions */}
        <div className="w-2/5 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">{step.title}</h2>
              </div>
              <p className="text-gray-300">{step.description}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">💡 개념 설명</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{step.explanation}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">📝 과제</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>왼쪽 코드 에디터에서 증명을 완성하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>sorry를 실제 증명으로 바꾸세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>"실행" 버튼으로 검증하세요</span>
                </li>
              </ul>
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-1">힌트</h4>
                    <p className="text-sm text-yellow-200">{step.hint}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? '힌트 숨기기' : '힌트 보기'}
            </button>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full p-6 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              style={{ fontFamily: 'Monaco, Menlo, monospace' }}
              spellCheck={false}
            />
          </div>

          {/* Action Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-red-900/30 border border-red-700'
                }`}
              >
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold">정답입니다! 🎉</p>
                      <p className="text-sm text-green-300">다음 단계로 진행하세요</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-semibold">다시 시도해보세요</p>
                      <p className="text-sm text-red-300 whitespace-pre-wrap font-mono mt-1 bg-black/20 p-2 rounded border border-red-900/30">{errorMessage || '증명이 완전하지 않습니다'}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                이전
              </button>

              <button
                onClick={checkCode}
                disabled={completing}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {completing ? '검증 중...' : '실행하기'}
              </button>

              {currentStep === tutorial.steps.length - 1 ? (
                <button
                  onClick={() => {
                    setShowCompleteModal(true);
                    triggerConfetti();
                  }}
                  disabled={!isCorrect}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-95 disabled:scale-100 disabled:shadow-none"
                >
                  완료 🎉
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!isCorrect}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition flex items-center gap-2"
                >
                  다음
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Celebration Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCompleteModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative max-w-md w-full bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/70 rounded-2xl shadow-2xl p-8 overflow-hidden text-center z-10"
          >
            {/* Glowing background light */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Icon Banner */}
            <div className="relative flex justify-center mb-6">
              {/* Confetti Background Sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-24 h-24 m-auto flex items-center justify-center text-indigo-500/30"
              >
                <Sparkles className="w-16 h-16 absolute -top-2 -left-2 animate-pulse" />
                <Sparkles className="w-12 h-12 absolute -bottom-2 -right-2 animate-pulse" />
              </motion.div>

              {/* Main Trophy */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 border-2 border-yellow-200/50"
              >
                <Trophy className="w-10 h-10 text-gray-900" />
              </motion.div>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              🎉 튜토리얼 완료!
            </h2>
            <p className="text-indigo-400 font-semibold text-sm mb-4">
              {tutorial.title}
            </p>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              모든 증명을 완수하고 Lean 4의 수학적 검증을 통과하셨습니다! <br />
              증명의 개념과 규칙을 훌륭히 마스터하셨습니다.
            </p>

            {/* Statistics */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-6 flex items-center justify-around">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {tutorial.steps.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">완료한 단계 수</div>
              </div>
              <div className="w-px h-8 bg-gray-800" />
              <div>
                <div className="text-2xl font-bold text-indigo-400">100%</div>
                <div className="text-xs text-gray-500 mt-1">진행률</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/tutorials"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                튜토리얼 목록으로 돌아가기
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsCorrect(null);
                  setShowCompleteModal(false);
                }}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl border border-gray-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                다시 풀어보기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
