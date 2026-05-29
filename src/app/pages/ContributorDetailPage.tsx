import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Star, Code2, Calendar, MessageSquare, CheckCircle, BookOpen, FileText, Wrench, Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "../services/userService";

const activityIcons: Record<string, typeof CheckCircle> = {
  proof: CheckCircle, answer: MessageSquare, review: FileText,
  tutorial: BookOpen, tool: Wrench,
};

export function ContributorDetailPage() {
  const { contributorId } = useParams();
  const [rawContributor, setRawContributor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await userService.getUserProfile(Number(contributorId));
        if (data && typeof data === 'object' && data.id) {
          setRawContributor(data);
        } else {
          setRawContributor(null);
        }
      } catch (error) {
        console.error("Failed to fetch contributor profile:", error);
        setRawContributor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [contributorId]);

  const contributor = rawContributor;
  const languages: string[] = contributor?.languages || [];
  const achievements: any[] = contributor?.achievements || [];
  const recentActivity: any[] = contributor?.recentActivity || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!contributor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">기여자를 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-6">요청하신 기여자 프로필이 존재하지 않습니다.</p>
          <Link to="/contributors" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />기여자 목록으로
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/contributors" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />기여자 목록
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Profile header */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0">
                  {contributor.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{contributor.name}</h1>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">{contributor.badge}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{contributor.role}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Code2 className="w-3.5 h-3.5" /><span>{contributor.field}</span>
                    <span>·</span>
                    <Calendar className="w-3.5 h-3.5" /><span>{contributor.joinDate} 가입</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-6">{contributor.bio}</p>

              {/* Languages */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{lang}</span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "증명", value: contributor.proofs, color: "text-green-700", bg: "bg-green-50 border-green-200" },
                { label: "답변", value: contributor.answers, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                { label: "평판", value: contributor.reputation, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: true },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-5 text-center ${s.bg}`}>
                  <div className={`text-2xl font-bold ${s.color} flex items-center justify-center gap-1`}>
                    {s.icon && <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />}{s.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />업적
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                      <div className="text-xs text-gray-500">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">최근 활동</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.map((act, i) => {
                  const Icon = activityIcons[act.type] || CheckCircle;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{act.title}</div>
                        <div className="text-xs text-gray-400">{act.type} · {act.date}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="hidden lg:block space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">프로필 정보</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">역할</dt><dd className="text-gray-900 font-medium">{contributor.badge}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">전문 분야</dt><dd className="text-gray-900 font-medium text-right">{contributor.field}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">가입일</dt><dd className="text-gray-900 font-medium">{contributor.joinDate}</dd></div>
              </dl>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">사용 언어</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center gap-2 text-sm">
                    <Code2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-700">{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
