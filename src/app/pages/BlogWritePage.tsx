import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Edit2, Sparkles, Clock, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { blogService } from '../services/blogService';

// Markdown parser duplicated from BlogDetailPage for identical preview rendering
function renderMarkdown(md: string): string {
  let html = md;
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
  // paragraphs
  html = html.split("\n\n").map((block) => {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("<h") || trimmed.startsWith("<pre") || trimmed.startsWith("<ul") || trimmed.startsWith("<ol") || trimmed.startsWith("<div") || trimmed.startsWith("<li")) return trimmed;
    return `<p class="text-gray-600 leading-relaxed mb-4">${trimmed}</p>`;
  }).join("\n");

  return html;
}

export function BlogWritePage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState({
    title: '',
    category: '튜토리얼',
    readTime: '5분',
    excerpt: '',
    imageUrl: '',
    content: ''
  });
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login?redirect=/blog/write');
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
      setErrorMessage('제목을 입력해주세요.');
      return;
    }
    if (!form.excerpt.trim()) {
      setErrorMessage('한 줄 요약을 입력해주세요.');
      return;
    }
    if (!form.content.trim()) {
      setErrorMessage('본문 내용을 입력해주세요.');
      return;
    }

    setPublishing(true);
    setErrorMessage('');

    try {
      const payload = {
        title: form.title,
        category: form.category,
        readTime: form.readTime,
        excerpt: form.excerpt,
        imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1754304342490-2fa390075d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYXRoZW1hdGljcyUyMGFic3RyYWN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        content: form.content
      };

      const response = await blogService.createBlog(payload);
      if (response && response.id) {
        navigate(`/blog/${response.id}`);
      } else {
        navigate('/blog');
      }
    } catch (error: any) {
      console.error('Failed to publish blog post:', error);
      setErrorMessage(error.message || '글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Bar */}
      <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/blog" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="text-base font-semibold text-gray-900">블로그 글 쓰기</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Tab Toggle */}
          <div className="flex lg:hidden bg-gray-100 p-0.5 rounded-lg border border-gray-200 mr-2">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'write' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              편집
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              미리보기
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={publishing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin animate-spin-fast" />
                등록 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                등록하기
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 grid lg:grid-cols-2 overflow-hidden h-[calc(100vh-3.5rem)]">
        {/* Left Column: Editor Form */}
        <div className={`p-6 overflow-y-auto border-r border-gray-200 bg-white flex flex-col gap-6 ${
          activeTab === 'write' ? 'block' : 'hidden lg:block'
        }`}>
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <span className="font-semibold">오류:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grid for metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="튜토리얼">튜토리얼</option>
                <option value="인사이트">인사이트</option>
                <option value="비교 분석">비교 분석</option>
                <option value="케이스 스터디">케이스 스터디</option>
                <option value="커뮤니티">커뮤니티</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">읽기 시간</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="예: 5분, 10분"
                  value={form.readTime}
                  onChange={(e) => setForm(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">제목</label>
            <input
              type="text"
              placeholder="블로그 제목을 입력해주세요"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">한 줄 요약 (Excerpt)</label>
            <textarea
              rows={2}
              placeholder="메인 목록에서 카드에 표시될 한 줄 요약입니다"
              value={form.excerpt}
              onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">커버 이미지 URL (선택)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com/image.jpg (입력하지 않으면 기본 이미지 적용)"
                value={form.imageUrl}
                onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">본문 내용 (Markdown)</label>
            <textarea
              placeholder="마크다운 문법으로 글을 작성해주세요. 우측 프리뷰 패널(모바일에서는 '미리보기' 탭)에서 실시간으로 확인할 수 있습니다.&#10;&#10;## 제목 2&#10;### 제목 3&#10;- 목록 아이템&#10;**굵은 글씨** 및 `인라인 코드`&#10;&#10;```lean&#10;theorem my_proof : A = B := by rfl&#10;```"
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="flex-1 w-full p-4 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className={`p-6 overflow-y-auto bg-gray-50 ${
          activeTab === 'preview' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm min-h-full">
            {/* Category & ReadTime */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">
                {form.category || 'General'}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{form.readTime || '5분'} 읽기</span>
              </div>
            </div>

            {/* Title & Excerpt */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight break-words">
              {form.title || '제목이 여기에 표시됩니다'}
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed border-b border-gray-100 pb-5 break-words">
              {form.excerpt || '요약 글이 여기에 표시됩니다'}
            </p>

            {/* Content Preview */}
            {form.content.trim() ? (
              <div
                className="blog-content text-gray-600 prose prose-indigo max-w-none text-sm break-words leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText className="w-10 h-10 mb-3 text-gray-300 stroke-[1.5]" />
                <p className="text-sm">마크다운을 작성하면 여기에 실시간으로 렌더링됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
