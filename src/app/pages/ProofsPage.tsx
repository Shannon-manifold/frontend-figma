import { motion } from "motion/react";
import { TheoremCard } from "../components/TheoremCard";
import { FilterBar } from "../components/FilterBar";
import { TrendingUp, Clock, Star, Loader2, Plus, X, Users, Eye, Edit2, FileText } from "lucide-react";
import { proofService } from "../services/proofService";
import { authService } from "../services/authService";
import { ProofResponse } from "../services/types";
import { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderMarkdownWithLatex(text: string): string {
  if (!text) return "";
  
  // 1. Temporarily extract LaTeX math environments to protect them from Markdown processing
  const mathBlocks: string[] = [];
  let blockId = 0;
  
  // Display math $$...$$
  let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    let rendered = "";
    try {
      rendered = katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true
      });
    } catch {
      rendered = `<pre class="overflow-x-auto text-red-500">${math}</pre>`;
    }
    const placeholder = `<!--MATHBLOCK_${blockId}-->`;
    mathBlocks.push(rendered);
    blockId++;
    return placeholder;
  });

  // Inline math $...$
  processed = processed.replace(/\$([^$]+?)\$/g, (_, math) => {
    let rendered = "";
    try {
      rendered = katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true
      });
    } catch {
      rendered = `<code class="text-red-500">${math}</code>`;
    }
    const placeholder = `<!--MATHBLOCK_${blockId}-->`;
    mathBlocks.push(rendered);
    blockId++;
    return placeholder;
  });

  // 2. Apply Markdown parsing on the remaining parts
  let html = processed;
  // h3
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-gray-900 mt-6 mb-2">$1</h3>');
  // h2
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h2>');
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-indigo-700">$1</code>');
  // code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre class="bg-gray-900 text-gray-200 rounded-lg p-5 overflow-x-auto text-sm leading-relaxed my-4 font-mono">${code.trim()}</pre>`
  );
  // table
  html = html.replace(
    /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
    (_m, headerRow: string, bodyRows: string) => {
      const headers = headerRow.split("|").map((h: string) => h.trim()).filter(Boolean);
      const rows = bodyRows.trim().split("\n").map((row: string) =>
        row.split("|").map((c: string) => c.trim()).filter(Boolean)
      );
      return `<div class="overflow-x-auto my-4"><table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead><tr class="bg-gray-50">${headers.map((h: string) => `<th class="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row: string[]) => `<tr class="border-b border-gray-100">${row.map((c: string) => `<td class="px-4 py-2 text-gray-600">${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>`;
    }
  );
  // unordered list
  html = html.replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-gray-600 mb-1">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class="my-2">${match}</ul>`);
  // numbered list
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-gray-600 mb-1">$1</li>');

  // LaTeX specific math blocks
  html = html.replace(/\\begin\{proof\}/g, '<div class="proof-block border-l-2 border-indigo-500 pl-4 py-1 my-3 bg-gray-50/50 rounded-r-lg">');
  html = html.replace(/\\end\{proof\}/g, "</div>");
  html = html.replace(/\\begin\{enumerate\}/g, '<ol class="latex-enumerate list-decimal pl-6 space-y-1 my-3 text-gray-600">');
  html = html.replace(/\\end\{enumerate\}/g, "</ol>");
  html = html.replace(/\\begin\{itemize\}/g, '<ul class="latex-itemize list-disc pl-6 space-y-1 my-3 text-gray-600">');
  html = html.replace(/\\end\{itemize\}/g, "</ul>");
  html = html.replace(/\\item\s/g, "<li>");
  html = html.replace(/\\qed/g, '<span class="qed float-right font-serif font-bold text-indigo-600">∎</span>');

  // paragraphs
  html = html.split("\n\n").map((block) => {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("<h") || trimmed.startsWith("<pre") || trimmed.startsWith("<ul") || trimmed.startsWith("<ol") || trimmed.startsWith("<div") || trimmed.startsWith("<li")) return trimmed;
    return `<p class="text-gray-600 leading-relaxed mb-4">${trimmed}</p>`;
  }).join("\n");

  // 3. Restore the math blocks
  for (let i = 0; i < mathBlocks.length; i++) {
    html = html.replace(`<!--MATHBLOCK_${i}-->`, mathBlocks[i]);
  }

  return html;
}

export function ProofsPage() {
  const [proofList, setProofList] = useState<ProofResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

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

  const verifiedCount = proofList.filter(p => p.status === 'verified').length;
  const successRate = proofList.length > 0 
    ? ((verifiedCount / proofList.length) * 100).toFixed(1) + '%' 
    : '0%';
  const totalLikes = proofList.reduce((sum, p) => sum + (p.likes || 0), 0);
  
  const recentCount = proofList.filter(p => {
    if (!p.date) return false;
    const diff = Date.now() - new Date(p.date).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const proversCount = new Set(proofList.map(p => p.prover).filter(Boolean)).size;

  const stats = [
    { icon: TrendingUp, label: "검증률", value: successRate, color: "text-green-700" },
    { icon: Star, label: "총 추천수", value: totalLikes.toLocaleString(), color: "text-yellow-700" },
    { icon: Clock, label: "최근 7일 추가", value: `${recentCount}개`, color: "text-blue-700" },
    { icon: Users, label: "참여 증명자", value: `${proversCount}명`, color: "text-purple-700" },
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
            <p className="text-gray-500">증명 보조기로 검증한 정리들을 탐색하고 배워보세요</p>
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
                onClick={() => { setActiveTab('write'); setIsUploadModalOpen(true); }}
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
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">새 수학 정리 등록</h3>
                <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 hidden md:block" />
                {/* Tab selector for mobile / desktop preview */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'write' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'preview' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    미리보기
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Input Form */}
              <form 
                onSubmit={handleUploadSubmit} 
                className={`flex-1 overflow-y-auto p-6 space-y-4 ${
                  activeTab === 'write' ? 'block' : 'hidden md:block'
                }`}
              >
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
                  <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5"> LaTeX & 마크다운 설명/증명</label>
                  <textarea
                    value={uploadForm.latex}
                    onChange={(e) => setUploadForm({ ...uploadForm, latex: e.target.value })}
                    placeholder="수식은 $a^2 + b^2 = c^2$ 이나 $$\sum x$$ 과 같이 작성하세요. 마크다운도 완벽 지원합니다."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">증명 소스 코드 (선택사항)</label>
                  <textarea
                    value={uploadForm.code}
                    onChange={(e) => setUploadForm({ ...uploadForm, code: e.target.value })}
                    placeholder="theorem pythagoras ... := by ..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors resize-none leading-relaxed"
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

              {/* Right Column: Live Preview */}
              <div 
                className={`flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800 ${
                  activeTab === 'preview' ? 'block' : 'hidden md:block'
                }`}
              >
                <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm min-h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 rounded text-xs font-medium">
                      {uploadForm.field || "분야"}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded text-xs font-medium">
                      {uploadForm.language || "언어"}
                    </span>
                  </div>
                  
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight break-words">
                    {uploadForm.title || "정리 제목이 이곳에 표시됩니다"}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 leading-relaxed break-words">
                    {uploadForm.description || "한 줄 설명이 이곳에 표시됩니다"}
                  </p>

                  {uploadForm.latex.trim() ? (
                    <div 
                      className="latex-preview text-sm text-gray-700 dark:text-zinc-300 prose prose-indigo max-w-none break-words leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownWithLatex(uploadForm.latex) }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-zinc-600">
                      <FileText className="w-10 h-10 mb-3 stroke-[1.5] text-gray-300 dark:text-zinc-700" />
                      <p className="text-xs">수식 및 마크다운 내용을 작성하면 여기에 실시간으로 렌더링됩니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

