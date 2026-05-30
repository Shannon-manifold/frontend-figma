import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, User, Heart, MessageSquare, Share2, Bookmark, Loader2, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useEffect, useState } from "react";
import { blogService } from "../services/blogService";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import katex from "katex";
import "katex/dist/katex.min.css";
import { BlogPostResponse, BlogPostDetailResponse, CommentResponse } from "../services/types";

function renderMarkdown(md: string): string {
  if (!md) return "";
  
  // 1. Temporarily extract LaTeX math environments to protect them from Markdown processing
  const mathBlocks: string[] = [];
  let blockId = 0;
  
  // Display math $$...$$
  let processed = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
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

export function BlogDetailPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostResponse[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const handleCommentEditStart = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
  };

  const handleCommentEditSave = async (commentId: number) => {
    if (!editingCommentText.trim()) return;
    try {
      await blogService.updateComment(commentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText("");
      await fetchComments();
    } catch (err) {
      console.error("Failed to edit comment:", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await blogService.deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handlePostDelete = async () => {
    if (!post) return;
    if (!window.confirm("정말로 이 포스트를 삭제하시겠습니까?")) return;
    try {
      await blogService.deleteBlog(post.id);
      alert("포스트가 삭제되었습니다.");
      navigate("/blog");
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      alert("포스트 삭제에 실패했습니다.");
    }
  };

  const fetchComments = async () => {
    if (!blogId) return;
    try {
      const data = await blogService.getComments(Number(blogId));
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!authService.isAuthenticated()) {
      alert("로그인이 필요한 서비스입니다.");
      navigate(`/login?redirect=/blog/${blogId}`);
      return;
    }
    setSubmittingComment(true);
    try {
      await blogService.createComment(Number(blogId), commentInput);
      setCommentInput("");
      await fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await blogService.getBlogDetail(Number(blogId));
        if (data && typeof data === 'object') {
          setPost(data);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    fetchComments();
  }, [blogId]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!post) return;
      try {
        const data = await blogService.getBlogs();
        if (Array.isArray(data)) {
          setRelatedPosts(data.filter((p) => p.id !== post.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      }
    };
    fetchRelated();
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">포스트를 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-6">요청하신 블로그 글이 존재하지 않습니다.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />블로그 목록으로
          </Link>
        </motion.div>
      </div>
    );
  }

  const renderedContent = renderMarkdown(post.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />블로그
          </Link>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg transition-colors ${bookmarked ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>
              <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" />
            </motion.button>
            {currentUser && currentUser.id === post.authorId && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePostDelete}
                className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Hero image */}
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8 bg-gray-100">
            <ImageWithFallback src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/95 rounded-full text-xs font-medium text-gray-700">{post.category}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-500 mb-6 leading-relaxed">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 pb-8 border-b border-gray-200 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{post.authorName?.[0] || '?'}</div>
              <span className="font-medium text-gray-700">{post.authorName}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</div>
            <span>·</span>
            <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime} 읽기</div>
          </div>

          {/* Content */}
          <div className="py-8 blog-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${liked ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />{liked ? "좋아요 취소" : "좋아요"}
            </motion.button>
            <div className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-medium bg-gray-100 rounded-lg">
              <MessageSquare className="w-4 h-4" />댓글 {comments.length}개
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                댓글 {comments.length}
              </h3>
            </div>

            {/* Comment Input */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/20">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    placeholder="댓글을 남겨보세요..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    disabled={submittingComment}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all bg-white"
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCommentSubmit}
                      disabled={submittingComment || !commentInput.trim()}
                      className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[60px]"
                    >
                      {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : "등록"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment List */}
            <div className="divide-y divide-gray-50">
              {comments.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-400">
                  첫 번째 댓글을 남겨보세요.
                </div>
              ) : (
                comments.map((comment, i) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="px-6 py-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.authorName ? comment.authorName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.authorName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {comment.date}
                            </span>
                          </div>
                          {currentUser && currentUser.id === comment.authorId && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {editingCommentId === comment.id ? (
                                <>
                                  <button onClick={() => handleCommentEditSave(comment.id)} className="hover:text-indigo-600 font-medium cursor-pointer">저장</button>
                                  <span>·</span>
                                  <button onClick={() => { setEditingCommentId(null); setEditingCommentText(""); }} className="hover:text-gray-600 font-medium cursor-pointer">취소</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleCommentEditStart(comment.id, comment.content)} className="hover:text-indigo-600 font-medium cursor-pointer">수정</button>
                                  <span>·</span>
                                  <button onClick={() => handleCommentDelete(comment.id)} className="hover:text-red-500 font-medium cursor-pointer">삭제</button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {editingCommentId === comment.id ? (
                          <textarea
                            rows={2}
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none mt-1 bg-white"
                          />
                        ) : (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">관련 포스트</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} to={`/blog/${rp.id}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="h-32 overflow-hidden bg-gray-100">
                    <ImageWithFallback src={rp.imageUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-400 mb-1">{rp.category}</div>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{rp.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}
