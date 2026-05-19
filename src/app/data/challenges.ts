export interface Challenge {
  id: number;
  title: string;
  field: string;
  description: string;
  prize: string;
  sponsorPool: string;
  backers: number;
  progress: number;
  difficulty: "Millennium" | "Hard" | "Medium";
  proofSystem: string;
  accent: string;
  createdAt: string;
  updatedAt: string;
  detailedDescription: string;
  references: { title: string; url: string }[];
  verificationCriteria: string[];
}

export const challenges: Challenge[] = [
  {
    id: 7,
    title: "리만 가설",
    field: "해석적 정수론",
    description: "리만 제타 함수의 비자명한 영점이 모두 실수부 1/2 위에 놓인다는 난제입니다.",
    prize: "$1,000,000", sponsorPool: "$742,500", backers: 1284, progress: 74,
    difficulty: "Millennium", proofSystem: "Lean 4",
    accent: "from-amber-300 to-yellow-500",
    createdAt: "2024-01-15", updatedAt: "2026-05-01",
    detailedDescription: "1859년 베른하르트 리만이 제시한 이 가설은 리만 제타 함수 ζ(s)의 비자명 영점이 모두 복소 평면에서 Re(s) = 1/2인 직선(임계선) 위에 존재한다고 주장합니다. 이 가설은 소수의 분포에 대한 가장 정밀한 추정을 가능하게 하며, 현대 수론의 중심 난제입니다.",
    references: [
      { title: "Riemann (1859), On the Number of Primes Less Than a Given Magnitude", url: "https://www.claymath.org/sites/default/files/riemann1859.pdf" },
      { title: "Clay Mathematics Institute – Riemann Hypothesis", url: "https://www.claymath.org/millennium-problems/riemann-hypothesis" },
    ],
    verificationCriteria: [
      "Lean 4 또는 동등한 증명 보조기에서 완전히 형식화된 증명",
      "Mathlib 호환 가능한 정의와 보조정리 사용",
      "커뮤니티 검증 위원회의 3인 이상 독립 리뷰 통과",
    ],
  },
  {
    id: 8,
    title: "P 대 NP 문제",
    field: "계산 복잡도 이론",
    description: "빠르게 검증할 수 있는 모든 문제가 빠르게 풀릴 수도 있는지 묻는 컴퓨터 과학의 핵심 난제입니다.",
    prize: "$1,000,000", sponsorPool: "$681,200", backers: 997, progress: 68,
    difficulty: "Millennium", proofSystem: "Coq",
    accent: "from-emerald-300 to-teal-500",
    createdAt: "2024-01-15", updatedAt: "2026-04-28",
    detailedDescription: "1971년 스티븐 쿡이 공식적으로 제시한 이 문제는, 다항 시간에 검증할 수 있는 문제(NP)가 반드시 다항 시간에 풀 수 있는지(P) 묻습니다. P ≠ NP일 경우, 본질적으로 '검증은 쉽지만 풀기는 어려운' 문제가 존재한다는 의미입니다.",
    references: [
      { title: "Cook (1971), The Complexity of Theorem-Proving Procedures", url: "https://www.cs.toronto.edu/~sacook/homepage/1971.pdf" },
      { title: "Clay Mathematics Institute – P vs NP", url: "https://www.claymath.org/millennium-problems/p-vs-np-problem" },
    ],
    verificationCriteria: [
      "Coq 또는 동등한 증명 보조기에서 완전히 형식화된 증명",
      "튜링 기계 모델에 기반한 계산 복잡도 정의 사용",
      "P = NP 또는 P ≠ NP 중 하나를 증명",
    ],
  },
  {
    id: 9,
    title: "버치-스위너턴다이어 추측",
    field: "대수기하 · 정수론",
    description: "타원곡선의 유리점 구조와 L-함수의 영점 차수가 깊게 연결되어 있다는 추측입니다.",
    prize: "$1,000,000", sponsorPool: "$528,900", backers: 763, progress: 53,
    difficulty: "Millennium", proofSystem: "Isabelle",
    accent: "from-cyan-300 to-blue-500",
    createdAt: "2024-02-01", updatedAt: "2026-04-20",
    detailedDescription: "1965년 브라이언 버치와 피터 스위너턴다이어가 수치 실험을 바탕으로 제시한 이 추측은, 타원곡선 E/Q의 모델-베유 L-함수 L(E, s)의 s=1에서의 영점 차수가 E(Q)의 rank와 같다고 주장합니다.",
    references: [
      { title: "Birch & Swinnerton-Dyer (1965), Notes on Elliptic Curves", url: "" },
      { title: "Clay Mathematics Institute – BSD Conjecture", url: "https://www.claymath.org/millennium-problems/birch-and-swinnerton-dyer-conjecture" },
    ],
    verificationCriteria: [
      "Isabelle/HOL 또는 동등한 증명 보조기에서 형식화",
      "타원곡선과 L-함수의 형식적 정의 포함",
      "rank와 영점 차수의 동치 증명",
    ],
  },
  {
    id: 10,
    title: "호지 추측",
    field: "대수기하",
    description: "복소 대수다양체의 특정 코호몰로지 클래스가 대수적 순환으로 표현되는지 묻습니다.",
    prize: "$1,000,000", sponsorPool: "$419,300", backers: 512, progress: 42,
    difficulty: "Millennium", proofSystem: "Lean 4",
    accent: "from-fuchsia-300 to-rose-500",
    createdAt: "2024-02-15", updatedAt: "2026-04-15",
    detailedDescription: "비특이 사영 대수다양체 위의 특정 코호몰로지 클래스(호지 클래스)가 대수적 순환의 유리 선형결합으로 표현될 수 있는지 묻는 문제입니다.",
    references: [
      { title: "Hodge (1950), The Topological Invariants of Algebraic Varieties", url: "" },
      { title: "Clay Mathematics Institute – Hodge Conjecture", url: "https://www.claymath.org/millennium-problems/hodge-conjecture" },
    ],
    verificationCriteria: [
      "Lean 4에서 복소 대수다양체의 코호몰로지 정의 포함",
      "호지 클래스의 형식적 정의와 대수적 순환 표현 증명",
      "커뮤니티 검증 위원회의 리뷰 통과",
    ],
  },
  {
    id: 11,
    title: "나비에-스토크스 존재성과 매끄러움",
    field: "편미분방정식",
    description: "3차원 비압축성 유체 방정식의 해가 항상 존재하고 매끄러운지 밝히는 문제입니다.",
    prize: "$1,000,000", sponsorPool: "$390,600", backers: 448, progress: 39,
    difficulty: "Millennium", proofSystem: "Agda",
    accent: "from-orange-300 to-red-500",
    createdAt: "2024-03-01", updatedAt: "2026-04-10",
    detailedDescription: "3차원 유클리드 공간에서 나비에-스토크스 방정식의 초기값 문제에 대해, 매끄러운 초기 조건이 주어졌을 때 모든 시간에 대해 매끄러운 해가 존재하는지 증명하거나 반례를 찾는 문제입니다.",
    references: [
      { title: "Fefferman (2000), Existence and Smoothness of the Navier-Stokes Equation", url: "https://www.claymath.org/sites/default/files/navierstokes.pdf" },
      { title: "Clay Mathematics Institute – Navier-Stokes", url: "https://www.claymath.org/millennium-problems/navier-stokes-equation" },
    ],
    verificationCriteria: [
      "Agda 또는 동등한 증명 보조기에서 형식화",
      "해의 존재성 또는 비존재성(반례) 증명",
      "매끄러움(smoothness) 조건의 형식적 정의 포함",
    ],
  },
  {
    id: 12,
    title: "양-밀스 질량 간극",
    field: "수리물리",
    description: "양-밀스 이론의 엄밀한 구성과 양의 질량 간극 존재를 증명하는 문제입니다.",
    prize: "$1,000,000", sponsorPool: "$356,800", backers: 391, progress: 36,
    difficulty: "Millennium", proofSystem: "Lean 4",
    accent: "from-violet-300 to-indigo-500",
    createdAt: "2024-03-15", updatedAt: "2026-04-05",
    detailedDescription: "4차원 유클리드 공간에서 임의의 콤팩트 단순 게이지 군에 대해 양-밀스 이론이 존재하고 양의 질량 간극(Δ > 0)을 가진다는 것을 증명하는 문제입니다.",
    references: [
      { title: "Jaffe & Witten (2000), Quantum Yang-Mills Theory", url: "https://www.claymath.org/sites/default/files/yangmills.pdf" },
      { title: "Clay Mathematics Institute – Yang-Mills", url: "https://www.claymath.org/millennium-problems/yang-mills-and-mass-gap" },
    ],
    verificationCriteria: [
      "Lean 4에서 양-밀스 이론의 수학적 구성 형식화",
      "질량 간극의 존재 증명",
      "물리학 검증 위원회 추가 리뷰 필요",
    ],
  },
];

export function getChallengeById(id: number): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}
