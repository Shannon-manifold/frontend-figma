import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Heart,
  MessageSquare,
  Code,
  Share2,
  Bookmark,
  Copy,
  ChevronDown,
  ChevronUp,
  User,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { proofService } from "../services/proofService";
import { userService } from "../services/userService";

function renderLatex(latex: string): string {
  // Split by display math ($$...$$), then process inline math ($...$)
  const parts: string[] = [];
  const displayRegex = /\$\$([\s\S]*?)\$\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = displayRegex.exec(latex)) !== null) {
    // Process text before this display math
    if (match.index > lastIndex) {
      parts.push(processInlineMath(latex.slice(lastIndex, match.index)));
    }
    // Render display math
    try {
      parts.push(
        katex.renderToString(match[1].trim(), {
          displayMode: true,
          throwOnError: false,
          trust: true,
        })
      );
    } catch {
      parts.push(`<pre>${match[1]}</pre>`);
    }
    lastIndex = match.index + match[0].length;
  }
  // Process remaining text
  if (lastIndex < latex.length) {
    parts.push(processInlineMath(latex.slice(lastIndex)));
  }

  return parts.join("");
}

function processInlineMath(text: string): string {
  return text.replace(/\$([^$]+?)\$/g, (_, expr) => {
    try {
      return katex.renderToString(expr.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return `<code>${expr}</code>`;
    }
  });
}

function processLatexToHtml(latex: string): string {
  let html = latex;

  // Remove \section*, \textbf headers → <h3>
  html = html.replace(/\\section\*?\{(.+?)\}/g, "");

  // \textbf{...} → <strong>
  html = html.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");
  // \textit{...} → <em>
  html = html.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
  // \text{...} → <span>
  html = html.replace(/\\text\{([^}]+)\}/g, "<span>$1</span>");

  // \begin{proof}...\end{proof}
  html = html.replace(/\\begin\{proof\}/g, '<div class="proof-block">');
  html = html.replace(/\\end\{proof\}/g, "</div>");

  // \begin{enumerate}...\end{enumerate}
  html = html.replace(/\\begin\{enumerate\}/g, '<ol class="latex-enumerate">');
  html = html.replace(/\\end\{enumerate\}/g, "</ol>");

  // \begin{itemize}...\end{itemize}
  html = html.replace(/\\begin\{itemize\}/g, '<ul class="latex-itemize">');
  html = html.replace(/\\end\{itemize\}/g, "</ul>");

  // \item
  html = html.replace(/\\item\s/g, "<li>");

  // \begin{align*}...\end{align*}
  html = html.replace(
    /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g,
    (_, content) => {
      // Convert align to gathered for KaTeX (simpler)
      const cleaned = content
        .replace(/&/g, "")
        .replace(/\\\\/g, "\\\\")
        .replace(/&&\s*\\text\{[^}]*\}/g, "")
        .trim();
      try {
        return katex.renderToString(
          `\\begin{aligned}${content.trim()}\\end{aligned}`,
          { displayMode: true, throwOnError: false, trust: true }
        );
      } catch {
        return `<pre>${content}</pre>`;
      }
    }
  );

  // \qed → ∎
  html = html.replace(/\\qed/g, '<span class="qed">∎</span>');

  // Line breaks
  html = html.replace(/\\\\/g, "<br />");

  // Render remaining math
  html = renderLatex(html);

  // Double newlines → paragraphs
  html = html.replace(/\n\n+/g, '</p><p class="latex-paragraph">');
  html = `<p class="latex-paragraph">${html}</p>`;

  return html;
}

const statusConfig = {
  verified: {
    icon: CheckCircle,
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    label: "검증됨",
    description: "이 증명은 증명 보조기에 의해 형식적으로 검증되었습니다.",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    label: "검증 중",
    description: "이 증명은 현재 검증 중이며 아직 완료되지 않았습니다.",
  },
  failed: {
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    label: "검증 실패",
    description:
      "이 증명의 형식적 검증에서 오류가 발견되었습니다. 수정이 필요합니다.",
  },
};

const sampleComments = [
  {
    author: "수학도",
    avatar: "S",
    time: "2시간 전",
    text: "정말 깔끔한 증명이네요. 3단계에서 유일 인수분해를 사용하는 부분이 인상적입니다.",
  },
  {
    author: "ProofMaster",
    avatar: "P",
    time: "5시간 전",
    text: "Lean 4 코드도 함께 올려주셔서 감사합니다. 직접 실행해볼 수 있어서 좋아요.",
  },
  {
    author: "정수론팬",
    avatar: "정",
    time: "1일 전",
    text: "혹시 n=4인 경우로 확장하는 것도 가능할까요? 관련 참고 자료가 있으면 공유 부탁드립니다.",
  },
];

export function ProofDetailPage() {
  const { proofId } = useParams();
  const navigate = useNavigate();
  
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [showCode, setShowCode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await proofService.getProofDetail(Number(proofId));
        if (data && typeof data === 'object') {
          setProof(data);
        } else {
          setProof(null);
        }
      } catch (error) {
        console.error("Failed to fetch proof details:", error);
        setProof(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [proofId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to get current user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleVerify = async () => {
    if (!proof) return;
    setVerifying(true);
    try {
      const updated = await proofService.verifyProof(proof.id);
      setProof(updated);
      alert(`검증 완료! 결과: ${updated.status === 'verified' ? '성공' : '실패'}`);
    } catch (error: any) {
      console.error("Verification failed:", error);
      alert(error.message || "검증 실행 중 오류가 발생했습니다.");
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!proof) return;
    if (!window.confirm("이 증명을 정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await proofService.deleteProof(proof.id);
      alert("증명이 성공적으로 삭제되었습니다.");
      navigate("/proofs");
    } catch (error: any) {
      console.error("Failed to delete proof:", error);
      alert(error.message || "증명 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            증명을 찾을 수 없습니다
          </h1>
          <p className="text-gray-500 mb-6">
            요청하신 증명이 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            to="/proofs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            증명 목록으로
          </Link>
        </motion.div>
      </div>
    );
  }

  const isProver = currentUser && proof && (currentUser.id === proof.proverId);
  const config = statusConfig[proof.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;
  const renderedHtml = processLatexToHtml(proof.latex);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(proof.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            to="/proofs"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            증명 목록
          </Link>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg transition-colors ${bookmarked
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Bookmark
                className="w-4 h-4"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {proof.field}
                    </span>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bg} ${config.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {proof.title}
                  </h1>
                  <p className="text-gray-500 leading-relaxed">
                    {proof.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {(proof.prover || proof.proverName)?.[0] || '?'}
                  </div>
                  <span className="font-medium text-gray-700">
                    {proof.prover || proof.proverName}
                  </span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" />
                  {proof.language}
                </div>
                <span>·</span>
                <span>{proof.date}</span>
              </div>
            </div>

            {/* Verification Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`rounded-xl border p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div>
                  <div className={`font-semibold text-sm ${config.color}`}>
                    {config.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {config.description}
                  </div>
                </div>
              </div>

              {isProver && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  disabled={verifying}
                  className="sm:flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      검증 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      형식 검증 실행하기
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>

            {/* LaTeX Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  증명 내용
                </h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopyLatex}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "복사됨!" : "LaTeX 복사"}
                </motion.button>
              </div>
              <div
                ref={contentRef}
                className="proof-content px-6 py-6 sm:px-8"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </motion.div>

            {/* Lean/Coq Code */}
            {proof.code && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6"
              >
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {proof.language} 코드
                    </span>
                  </div>
                  {showCode ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {showCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <pre className="px-6 py-5 text-sm font-mono text-gray-200 bg-gray-900 overflow-x-auto leading-relaxed">
                      {proof.code}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  댓글 {proof.comments ?? proof.commentsCount ?? 0}
                </h2>
              </div>

              {/* Comment input */}
              <div className="px-6 py-4 border-b border-gray-50">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="댓글을 남겨보세요..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        등록
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample comments */}
              <div className="divide-y divide-gray-50">
                {sampleComments.map((comment, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="px-6 py-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">
                            {comment.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:block space-y-6"
          >
            {/* Interaction */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLiked(!liked)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${liked
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={liked ? "currentColor" : "none"}
                  />
                  {liked ? (proof.likes || 0) + 1 : (proof.likes || 0)}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {proof.comments ?? proof.commentsCount ?? 0}
                </motion.button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                증명 정보
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">분야</dt>
                  <dd className="text-gray-900 font-medium">{proof.field}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">증명 언어</dt>
                  <dd className="text-gray-900 font-medium">
                    {proof.language}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">작성자</dt>
                  <dd className="text-gray-900 font-medium">{proof.prover || proof.proverName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">작성일</dt>
                  <dd className="text-gray-900 font-medium">{proof.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">상태</dt>
                  <dd
                    className={`font-medium flex items-center gap-1 ${config.color}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                  </dd>
                </div>
              </dl>

              {isProver && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        삭제 중...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        증명 삭제하기
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>

            {/* Related */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                관련 증명
              </h3>
              <div className="space-y-2">
                <Link
                  to="/proofs"
                  className="block text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  → 모든 증명 보기
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
