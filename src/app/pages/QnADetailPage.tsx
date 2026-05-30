import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, MessageCircle, ThumbsUp, Eye, Calendar, CheckCircle, ChevronUp, Share2, Bookmark, Tag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { questionService } from "../services/questionService";
import { userService } from "../services/userService";

function renderContent(text: string): string {
  let html = text;
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) =>
    `<pre class="bg-gray-900 text-gray-200 rounded-lg p-5 overflow-x-auto text-sm leading-relaxed my-4 font-mono"><code>${code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
  );
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-indigo-700">$1</code>');
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-gray-600 mb-1">$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-gray-600 mb-1">$1</li>');
  const lines = html.split("\n\n");
  html = lines.map((block) => {
    const t = block.trim();
    if (!t || t.startsWith("<pre") || t.startsWith("<li") || t.startsWith("<ul") || t.startsWith("<ol")) return t;
    return `<p class="text-gray-700 leading-relaxed mb-3">${t}</p>`;
  }).join("\n");
  return html;
}

export function QnADetailPage() {
  const { questionId } = useParams();
  const [rawQuestion, setRawQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const data = await questionService.getQuestionDetail(Number(questionId));
        if (data && typeof data === 'object') {
          setRawQuestion(data);
        } else {
          setRawQuestion(null);
        }
      } catch (error) {
        console.error("Failed to fetch question detail:", error);
        setRawQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const answersArray = rawQuestion && Array.isArray(rawQuestion.answers)
    ? rawQuestion.answers
    : (rawQuestion && Array.isArray(rawQuestion.answerList) ? rawQuestion.answerList : []);

  const question = rawQuestion ? {
    id: rawQuestion.id,
    title: rawQuestion.title,
    description: rawQuestion.description,
    author: rawQuestion.authorName || rawQuestion.author || "Anonymous",
    authorId: rawQuestion.authorId,
    date: rawQuestion.date,
    views: rawQuestion.views || 0,
    answers: rawQuestion.answersCount !== undefined ? rawQuestion.answersCount : (Array.isArray(rawQuestion.answers) ? rawQuestion.answers.length : (rawQuestion.answers || 0)),
    likes: rawQuestion.likes || 0,
    tags: rawQuestion.tags || [],
    status: rawQuestion.status === "answered" ? "answered" : "open",
    content: rawQuestion.content || "",
    answerList: answersArray.map((a: any) => ({
      id: a.id,
      author: a.authorName || a.author || "Anonymous",
      date: a.date,
      content: a.content || "",
      likes: a.likes || 0,
      accepted: !!a.accepted
    }))
  } : null;

  const handleLike = async () => {
    if (!question) return;
    try {
      const newLikes = await questionService.toggleQuestionLike(question.id);
      setLiked(!liked);
      setRawQuestion((prev: any) => ({ ...prev, likes: newLikes }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLiked(!liked);
    }
  };

  const handleBookmark = async () => {
    if (!question) return;
    try {
      await questionService.toggleBookmark(question.id);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      setBookmarked(!bookmarked);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!question || !answerContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      await questionService.createAnswer(question.id, { content: answerContent });
      const updated = await questionService.getQuestionDetail(question.id);
      setRawQuestion(updated);
      setAnswerContent("");
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("답변 등록에 실패했습니다. 로그인 상태를 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    if (!question) return;
    try {
      await questionService.acceptAnswer(answerId);
      alert("답변이 채택되었습니다.");
      const updated = await questionService.getQuestionDetail(question.id);
      setRawQuestion(updated);
    } catch (error: any) {
      console.error("Failed to accept answer:", error);
      alert(error.message || "답변 채택에 실패했습니다.");
    }
  };

  const handleAnswerLike = async (answerId: number) => {
    if (!question) return;
    try {
      const newLikes = await questionService.toggleAnswerLike(answerId);
      setRawQuestion((prev: any) => {
        if (!prev) return prev;
        const targetList = Array.isArray(prev.answers) ? prev.answers : (prev.answerList || []);
        const updatedAnswers = targetList.map((a: any) => 
          a.id === answerId ? { ...a, likes: newLikes } : a
        );
        return {
          ...prev,
          answers: Array.isArray(prev.answers) ? updatedAnswers : prev.answers,
          answerList: Array.isArray(prev.answerList) ? updatedAnswers : prev.answerList
        };
      });
    } catch (error) {
      console.error("Failed to toggle answer like:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">질문을 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-6">요청하신 질문이 존재하지 않습니다.</p>
          <Link to="/qna" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />Q&A 목록으로
          </Link>
        </motion.div>
      </div>
    );
  }

  const statusStyle = {
    answered: "bg-green-50 text-green-700 border-green-200",
    open: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const statusLabel = { answered: "답변완료", open: "답변대기" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/qna" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />Q&A
          </Link>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${bookmarked ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>
              <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Question */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight flex-1">{question.title}</h1>
                <span className={`px-3 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${statusStyle[question.status]}`}>
                  {statusLabel[question.status]}
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{question.author[0]}</div>
                  <span className="font-medium text-gray-700">{question.author}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{question.date}</div>
                <span>·</span>
                <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{question.views}회 조회</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {question.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs rounded-full font-medium">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="prose-sm" dangerouslySetInnerHTML={{ __html: renderContent(question.content) }} />
            </div>

            {/* Footer actions */}
            <div className="border-t border-gray-100 px-8 py-4 bg-gray-50/50 flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                <ChevronUp className="w-4 h-4" />{question.likes}
              </motion.button>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />{question.answers}개 답변
              </div>
            </div>
          </div>
        </motion.div>

        {/* Answers section */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{question.answerList.length}개의 답변</h2>
          </div>

          {question.answerList.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-500 text-sm mb-4">아직 답변이 없습니다. 첫 번째 답변을 달아보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {question.answerList.map((answer, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                  className={`bg-white rounded-xl border overflow-hidden ${answer.accepted ? "border-green-200 ring-1 ring-green-100" : "border-gray-200"}`}>
                  {answer.accepted && (
                    <div className="bg-green-50 px-6 py-2 flex items-center gap-2 border-b border-green-100">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">채택된 답변</span>
                    </div>
                  )}
                  <div className="p-6">
                    {/* Answer meta */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-xs font-bold">{answer.author[0]}</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{answer.author}</div>
                        <div className="text-xs text-gray-400">{answer.date}</div>
                      </div>
                    </div>

                    {/* Answer content */}
                    <div className="prose-sm" dangerouslySetInnerHTML={{ __html: renderContent(answer.content) }} />

                    {/* Answer actions */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAnswerLike(answer.id)}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />{answer.likes}
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />댓글
                        </motion.button>
                      </div>

                      {currentUser && currentUser.id === question.authorId && question.status !== 'answered' && !answer.accepted && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          답변 채택하기
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Write answer box */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">답변 작성하기</h3>
          <textarea
            rows={6}
            placeholder="답변을 작성해주세요. 마크다운과 코드 블록을 사용할 수 있습니다..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            disabled={submitting}
            className="w-full border border-gray-200 rounded-lg p-4 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">마크다운, ```코드 블록``` 지원</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAnswer}
              disabled={submitting}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50">
              {submitting ? "등록 중..." : "답변 등록"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

