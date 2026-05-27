import { motion } from "motion/react";
import { MessageCircle, ThumbsUp, Eye, Calendar, User, Award } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Link } from "react-router";
import { questions as mockQuestions } from "../data/questions";
import { questionService } from "../services/questionService";
import { useState, useEffect } from "react";

export function QnAPage() {
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await questionService.getQuestions();
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
          setQuestionList(data);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const questions = (questionList.length > 0 ? questionList : mockQuestions).map((q: any) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    author: q.authorName || q.author || "Anonymous",
    date: q.date,
    views: q.views || 0,
    answers: q.answersCount !== undefined ? q.answersCount : (q.answers || 0),
    likes: q.likes || 0,
    tags: q.tags || [],
    status: q.status === "answered" ? "answered" : "open",
  }));

  const statusStyle = {
    answered: "bg-green-50 text-green-700 border-green-200",
    open: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusLabel = {
    answered: "답변완료",
    open: "답변대기",
  };

  const statItems = [
    { label: "전체 질문", value: "2,847", icon: MessageCircle },
    { label: "답변 완료", value: "2,134", icon: Award },
    { label: "오늘의 질문", value: "23", icon: Calendar },
    { label: "활성 사용자", value: "456", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[288px_1fr] gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-72 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                <ImageWithFallback
                  src="https://upload.wikimedia.org/wikipedia/commons/7/79/Hilbert.jpg"
                  alt="David Hilbert"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <blockquote className="border-l-4 border-indigo-500 pl-6 mb-8">
                <p className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-snug">
                  우리는 알아야만 한다,
                  <br />
                  우리는 알게 될 것이다.
                </p>
                <p className="mt-4 text-sm text-gray-400 italic">
                  Wir müssen wissen. Wir werden wissen.
                </p>
              </blockquote>

              <div className="border-t border-gray-200 pt-5">
                <div className="font-semibold text-gray-900 mb-0.5">다비트 힐베르트</div>
                <div className="text-sm text-gray-500">David Hilbert</div>
                <div className="text-sm text-indigo-600 mt-1">20세기 수학의 선구자 · 1862–1943</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">커뮤니티 질문</h2>
              <p className="text-sm text-gray-500">증명 보조기 사용 중 궁금한 점을 함께 해결해요</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors font-medium"
            >
              질문하기
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <Link key={question.id} to={`/qna/${question.id}`} className="block">
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 flex-1 hover:text-indigo-600 transition-colors">
                      {question.title}
                    </h3>
                    <span className={`px-2.5 py-1 rounded border text-xs font-medium flex-shrink-0 ${statusStyle[question.status]}`}>
                      {statusLabel[question.status]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{question.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {question.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /><span>{question.author}</span></div>
                      <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{question.date}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span>{question.views}</span></div>
                      <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /><span>{question.answers}</span></div>
                      <div className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /><span>{question.likes}</span></div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors font-medium"
            >
              더 많은 질문 보기
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
