import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
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
  Loader2
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
      setShowHint(false);
    }
  }, [currentStep, step]);

  const checkCode = async () => {
    if (!step || !tutorialId) return;
    
    const normalized = userCode.trim().replace(/\s+/g, ' ');
    const solutionNormalized = (step.solution || '').trim().replace(/\s+/g, ' ');

    if (normalized === solutionNormalized || !normalized.includes('sorry')) {
      setIsCorrect(true);
      setCompleting(true);
      try {
        await tutorialService.completeStep(Number(tutorialId), step.id);
      } catch (err) {
        console.error('Failed to complete step:', err);
      } finally {
        setCompleting(false);
      }
    } else {
      setIsCorrect(false);
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
                className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                  isCorrect
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-red-900/30 border border-red-700'
                }`}
              >
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-green-400 font-semibold">정답입니다! 🎉</p>
                      <p className="text-sm text-green-300">다음 단계로 진행하세요</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-red-400 font-semibold">다시 시도해보세요</p>
                      <p className="text-sm text-red-300">증명이 완전하지 않습니다</p>
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
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                실행하기
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === tutorial.steps.length - 1 || !isCorrect}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition flex items-center gap-2"
              >
                다음
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
