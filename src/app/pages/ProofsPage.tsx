import { motion } from "motion/react";
import { TheoremCard } from "../components/TheoremCard";
import { FilterBar } from "../components/FilterBar";
import { Search, TrendingUp, Clock, Star, Loader2, Plus, X } from "lucide-react";
import { proofService } from "../services/proofService";
import { authService } from "../services/authService";
import { ProofResponse } from "../services/types";
import { useState, useEffect } from "react";

export function ProofsPage() {
  const [proofList, setProofList] = useState<ProofResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    field: "정수론",
    description: "",
    language: "Lean 4",
    latex: "",
    code: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchProofs = async () => {
    try {
      setLoading(true);
      const data = await proofService.getAllProofs();
      setProofList(data);
    } catch (error) {
      console.error("Failed to fetch proofs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProofs();
    setIsLoggedIn(authService.isAuthenticated());
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      setUploadError("정리 제목을 입력해 주세요.");
      return;
    }
    if (!uploadForm.description.trim()) {
      setUploadError("설명을 입력해 주세요.");
      return;
    }
    if (!uploadForm.latex.trim()) {
      setUploadError("LaTeX 증명을 입력해 주세요.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      await proofService.createProof({
        title: uploadForm.title,
        field: uploadForm.field,
        description: uploadForm.description,
        language: uploadForm.language,
        latex: uploadForm.latex,
        code: uploadForm.code,
        status: "pending",
      });

      setIsUploadModalOpen(false);
      setUploadForm({
        title: "",
        field: "정수론",
        description: "",
        language: "Lean 4",
        latex: "",
        code: "",
      });

      // Refresh list
      await fetchProofs();
    } catch (error: any) {
      console.error("Failed to upload proof:", error);
      setUploadError(error.message || "정리 업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { icon: TrendingUp, label: "검증률", value: "87.5%", color: "text-green-700" },
    { icon: Star, label: "인기 정리", value: "1,247", color: "text-yellow-700" },
    { icon: Clock, label: "최근 추가", value: "23개", color: "text-blue-700" },
    { icon: Search, label: "검색 횟수", value: "8.9K", color: "text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">검증된 증명</h1>
            <p className="text-gray-500 mb-8">증명 보조기로 검증한 정리들을 탐색하고 배워보세요</p>

            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-2xl">
              <Search className="w-5 h-5 text-gray-400 ml-1 flex-shrink-0" />
              <input
                type="text"
                placeholder="정리 이름, 분야, 증명자로 검색..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors font-medium"
              >
                검색
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 px-4 first:pl-0"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold text-gray-900">모든 증명</h2>
              <span className="text-sm text-gray-500">총 {proofList.length}개</span>
            </div>
            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                정리 업로드
              </motion.button>
            )}
          </div>

          <FilterBar />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              {proofList.map((theorem) => (
                <TheoremCard
                  key={theorem.id}
                  id={theorem.id}
                  title={theorem.title}
                  description={theorem.description}
                  status={theorem.status as 'verified' | 'pending' | 'failed'}
                  prover={theorem.prover}
                  language={theorem.language}
                  likes={theorem.likes}
                  comments={theorem.comments}
                  date={theorem.date}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-1 mt-10">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors">이전</motion.button>
            {[1, 2, 3, 4, 5].map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${page === 1 ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
              >
                {page}
              </motion.button>
            ))}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors">다음</motion.button>
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">새 수학 정리 등록</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">분야</label>
                  <select
                    value={uploadForm.field}
                    onChange={(e) => setUploadForm({ ...uploadForm, field: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors"
                  >
                    <option value="정수론">정수론</option>
                    <option value="해석학">해석학</option>
                    <option value="대수학">대수학</option>
                    <option value="기하학">기하학</option>
                    <option value="조합론">조합론</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">증명 언어</label>
                  <select
                    value={uploadForm.language}
                    onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors"
                  >
                    <option value="Lean 4">Lean 4</option>
                    <option value="Coq">Coq</option>
                    <option value="Isabelle">Isabelle</option>
                    <option value="Agda">Agda</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">정리 제목</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="예: 피타고라스 정리, 페르마의 소정리"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">한 줄 설명</label>
                <input
                  type="text"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="정리의 핵심 의미를 한 줄로 설명해 주세요."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">LaTeX 설명 및 증명</label>
                <textarea
                  value={uploadForm.latex}
                  onChange={(e) => setUploadForm({ ...uploadForm, latex: e.target.value })}
                  placeholder="\section*{피타고라스 정리} ..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">증명 소스 코드 (선택사항)</label>
                <textarea
                  value={uploadForm.code}
                  onChange={(e) => setUploadForm({ ...uploadForm, code: e.target.value })}
                  placeholder="theorem pythagoras ... := by ..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center justify-center min-w-[80px] px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "등록하기"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

