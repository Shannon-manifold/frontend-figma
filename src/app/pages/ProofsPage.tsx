import { motion } from "motion/react";
import { TheoremCard } from "../components/TheoremCard";
import { FilterBar } from "../components/FilterBar";
import { Search, TrendingUp, Clock, Star, Loader2 } from "lucide-react";
import { proofService } from "../services/proofService";
import { ProofResponse } from "../services/types";
import { useState, useEffect } from "react";

export function ProofsPage() {
  const [proofList, setProofList] = useState<ProofResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const data = await proofService.getAllProofs();
        setProofList(data);
      } catch (error) {
        console.error("Failed to fetch proofs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProofs();
  }, []);

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
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">모든 증명</h2>
            <span className="text-sm text-gray-500">총 {proofList.length}개</span>
          </div>

          <FilterBar />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              {proofList.map((theorem) => (
                <TheoremCard key={theorem.id} {...theorem} />
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
    </div>
  );
}
