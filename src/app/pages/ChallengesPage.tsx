import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeDollarSign,
  Clock,
  Gem,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useState, useEffect } from "react";
import { challengeService } from "../services/challengeService";

const wilesPortraitUrl =
  "https://mblogthumb-phinf.pstatic.net/MjAxOTA1MjBfMjk3/MDAxNTU4MzY0MjM2NDg3.lPmwKG7feBv7t1-t2EdCbD9V5OWEfBhgFF-V5-9IA-wg.-NA6WYy5LTJPXUDIVgNppKR_04S4Gd8O8RDh4DUa060g.PNG.math1505tj/SE-a2d185ee-3faf-4149-89b7-e6698557d5d6.png?type=w800";

const mockChallenges = [
  {
    id: 1,
    title: "리만 가설",
    field: "해석적 정수론",
    description:
      "리만 제타 함수의 비자명한 영점이 모두 실수부 1/2 위에 놓인다는 난제입니다.",
    prize: "$1,000,000",
    sponsorPool: "$742,500",
    backers: 1284,
    progress: 74,
    difficulty: "Millennium",
    proofSystem: "Lean 4",
    accent: "from-indigo-400 to-blue-600",
  },
  {
    id: 2,
    title: "P 대 NP 문제",
    field: "계산 복잡도 이론",
    description:
      "빠르게 검증할 수 있는 모든 문제가 빠르게 풀릴 수도 있는지 묻는 컴퓨터 과학의 핵심 난제입니다.",
    prize: "$1,000,000",
    sponsorPool: "$681,200",
    backers: 997,
    progress: 68,
    difficulty: "Millennium",
    proofSystem: "Coq",
    accent: "from-emerald-400 to-teal-600",
  },
  {
    id: 3,
    title: "버치-스위너턴다이어 추측",
    field: "대수기하 · 정수론",
    description:
      "타원곡선의 유리점 구조와 L-함수의 영점 차수가 깊게 연결되어 있다는 추측입니다.",
    prize: "$1,000,000",
    sponsorPool: "$528,900",
    backers: 763,
    progress: 53,
    difficulty: "Millennium",
    proofSystem: "Isabelle",
    accent: "from-cyan-400 to-sky-600",
  },
  {
    id: 4,
    title: "호지 추측",
    field: "대수기하",
    description:
      "복소 대수다양체의 특정 코호몰로지 클래스가 대수적 순환으로 표현되는지 묻습니다.",
    prize: "$1,000,000",
    sponsorPool: "$419,300",
    backers: 512,
    progress: 42,
    difficulty: "Millennium",
    proofSystem: "Lean 4",
    accent: "from-fuchsia-400 to-rose-600",
  },
  {
    id: 5,
    title: "나비에-스토크스 존재성과 매끄러움",
    field: "편미분방정식",
    description:
      "3차원 비압축성 유체 방정식의 해가 항상 존재하고 매끄러운지 밝히는 문제입니다.",
    prize: "$1,000,000",
    sponsorPool: "$390,600",
    backers: 448,
    progress: 39,
    difficulty: "Millennium",
    proofSystem: "Agda",
    accent: "from-orange-400 to-red-600",
  },
  {
    id: 6,
    title: "양-밀스 질량 간극",
    field: "수리물리",
    description:
      "양-밀스 이론의 엄밀한 구성과 양의 질량 간극 존재를 증명하는 문제입니다.",
    prize: "$1,000,000",
    sponsorPool: "$356,800",
    backers: 391,
    progress: 36,
    difficulty: "Millennium",
    proofSystem: "Lean 4",
    accent: "from-violet-400 to-purple-600",
  },
];

export function ChallengesPage() {
  const [challengeList, setChallengeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSponsors, setLocalSponsors] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await challengeService.getChallenges();
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
          setChallengeList(data);
        }
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleSponsor = async (id: number) => {
    try {
      const updated = await challengeService.sponsorChallenge(id);
      setChallengeList((prev) => prev.map((c) => c.id === id ? updated : c));
      alert("후원이 완료되었습니다!");
    } catch (error) {
      console.error("Failed to sponsor challenge, updating locally:", error);
      setLocalSponsors((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      alert("후원이 완료되었습니다! (로컬 적용)");
    }
  };

  const challenges = (challengeList.length > 0 ? challengeList : mockChallenges).map((c: any) => ({
    id: c.id,
    title: c.title,
    field: c.field,
    description: c.description,
    prize: c.prize,
    sponsorPool: c.sponsorPool,
    backers: c.backers + (localSponsors[c.id] || 0),
    progress: c.progress,
    difficulty: c.difficulty,
    proofSystem: c.proofSystem,
    accent: c.accent || "from-indigo-400 to-blue-600",
  }));

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative border-b border-gray-100 bg-gray-50/50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              OPEN PROBLEMS
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
              아직 이름 붙지 않은
              <br />
              <span className="text-indigo-600">세계의 경계로</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-10">
              인류가 아직 풀지 못한 난제를 형식 증명 커뮤니티와 함께 추적합니다.
              후원금은 검증 가능한 해결에 도달한 기여자에게 상금으로 지급됩니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              {[
                { label: "등록 난제", value: "6", icon: Target },
                { label: "총 후원 풀", value: "$3.1M", icon: BadgeDollarSign },
                { label: "참여 후원자", value: "4,395", icon: Users },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <item.icon className="w-5 h-5 text-indigo-500 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative w-fit max-w-full group mx-auto lg:mx-0">
                {/* Outer sophisticated frame */}
                <div className="relative rounded-[2rem] p-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-[20px_20px_60px_rgba(0,0,0,0.3),-5px_-5px_20px_rgba(255,255,255,0.05)] overflow-hidden">
                  {/* Subtle inner metallic glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-amber-500/10 opacity-50" />
                  
                  {/* The 'Mat' (white border inside the frame) */}
                  <div className="relative rounded-2xl bg-white p-8 shadow-inner">
                    {/* Inner gold/silver thin border */}
                    <div className="absolute inset-[30px] border border-amber-200/30 rounded-lg pointer-events-none" />
                    
                    {/* The Image container */}
                    <div className="relative overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-200 shadow-2xl">
                      <ImageWithFallback
                        src={wilesPortraitUrl}
                        alt="Andrew Wiles"
                        className="max-w-[400px] h-auto object-contain grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                      />
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Plaque-like detail */}
                    <div className="mt-6 flex flex-col items-center">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-200 to-transparent mb-2" />
                      <div className="text-[10px] tracking-[0.2em] text-amber-600/60 font-serif uppercase">
                        Oxford, United Kingdom
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                DARK MANSION
              </span>

              <blockquote className="space-y-4 border-l-4 border-indigo-200 pl-6">
                <p className="text-xl font-semibold leading-relaxed text-gray-900">
                  페르마의 마지막 정리를 증명했다는 것에 대해서 나 자신은 일종의 슬픔을 느낍니다. 아마 모든 수학자들도 의기소침해졌을 것입니다.
                </p>

                <p className="text-base leading-relaxed text-gray-600">
                  한 사람이 어두운 아파트 안으로 들어갔다고 상상해 봅시다. 칠흑같이 어두운 아파트말입니다. 처음에는 아무것도 보이지 않으니 이리저리 가구에 부딪쳐 넘어지면서 갈피를 잡지 못하겠지요. 하지만 이런 시행착오를 거듭하다보면 어둠 속에서도 가구의 위치들이 점차 머릿속에 그려질 겁니다.
                </p>

                <p className="text-base leading-relaxed text-gray-600">
                  이런 식으로 6개월을 지낸 뒤에 드디어 그 사람은 전등의 스위치를 발견하고 불을 켭니다. 그러면 모든 것이 일목요연하게 드러나면서 자신이 서있는 위치가 어디쯤이었는지를 정확하게 알게 되겠지요.
                </p>
              </blockquote>

              <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
                <p className="text-sm italic leading-relaxed text-indigo-900/70">
                  "Perhaps I could best describe my experience of doing mathematics in terms of entering a dark mansion... finally, after six months or so, you find the light switch and turn it on."
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="text-lg font-bold text-gray-900">
                  앤드류 와일스 경
                </div>
                <div className="text-sm text-gray-500">
                  Sir Andrew John Wiles · 페르마의 마지막 정리 증명자
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gray-50/30">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">후원 중인 난제</h2>
              <p className="text-gray-600">
                각 카드의 후원 풀은 상금으로 적립되며, 검증 절차를 통과한 해결자에게 지급됩니다.
              </p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              난제 등록하기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <motion.article
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${challenge.accent}`}
                />

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                        {challenge.difficulty}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                        {challenge.proofSystem}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-indigo-600/80 font-medium">
                      {challenge.field}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Gem className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8 h-12 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        해결 상금
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {challenge.prize}
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-indigo-500 opacity-20" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500 font-medium">후원 풀 적립 현황</span>
                      <span className="font-bold text-gray-900">
                        {challenge.sponsorPool}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${challenge.accent}`}
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {challenge.backers.toLocaleString()}명 참여
                    </span>
                    <span className="font-bold text-indigo-600">{challenge.progress}% 완료</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleSponsor(challenge.id)} className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition">
                    <BadgeDollarSign className="w-4 h-4" />
                    후원하기
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition">
                    <ShieldCheck className="w-4 h-4" />
                    검증 조건
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-indigo-100 bg-indigo-50/30 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Clock className="w-6 h-6 text-indigo-500 flex-shrink-0" />
              <p className="text-sm text-indigo-900/70 leading-relaxed">
                후원 기능은 현재 UI 프로토타입 단계입니다. 실제 결제 및 상금 지급 정책은
                향후 거버넌스 및 백엔드 연동을 통해 확정될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
