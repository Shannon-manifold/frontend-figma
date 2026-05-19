export interface Contributor {
  id: number;
  name: string;
  role: string;
  field: string;
  proofs: number;
  answers: number;
  reputation: string;
  badge: string;
  initial: string;
  bio: string;
  joinDate: string;
  languages: string[];
  achievements: { icon: string; title: string; desc: string }[];
  recentActivity: { type: string; title: string; date: string }[];
}

export const contributors: Contributor[] = [
  {
    id: 13, name: "김수학", role: "Lean 4 증명 기여자", field: "정수론 · 대수학",
    proofs: 128, answers: 342, reputation: "12.8K", badge: "Top Prover", initial: "김",
    bio: "서울대학교 수학과 박사과정에서 정수론을 연구하고 있습니다. Lean 4를 활용한 형식 증명에 관심이 많으며, 대수적 정수론 분야의 정리들을 형식화하는 작업을 주로 합니다.",
    joinDate: "2025-03-15", languages: ["Lean 4", "Coq"],
    achievements: [
      { icon: "🏆", title: "Top Prover 2026", desc: "연간 최다 검증 증명" },
      { icon: "⭐", title: "100+ 증명", desc: "100개 이상의 증명 기여" },
      { icon: "🎯", title: "Perfect Streak", desc: "30일 연속 기여" },
      { icon: "💬", title: "헬퍼", desc: "300개 이상의 답변" },
    ],
    recentActivity: [
      { type: "proof", title: "페르마의 마지막 정리 (n=3)", date: "2026-04-28" },
      { type: "answer", title: "Lean 4에서 귀납법 사용법", date: "2026-04-27" },
      { type: "proof", title: "유클리드 호제법의 정당성", date: "2026-04-22" },
    ],
  },
  {
    id: 14, name: "박증명", role: "Isabelle/HOL 리뷰어", field: "해석학 · 형식 검증",
    proofs: 97, answers: 286, reputation: "10.4K", badge: "Reviewer", initial: "박",
    bio: "KAIST에서 형식 검증 연구를 하고 있습니다. Isabelle/HOL을 주로 사용하며, 해석학 정리들의 형식화에 전문성을 갖추고 있습니다.",
    joinDate: "2025-04-02", languages: ["Isabelle", "Lean 4"],
    achievements: [
      { icon: "🔍", title: "Top Reviewer", desc: "가장 많은 증명 리뷰" },
      { icon: "📝", title: "정밀한 리뷰어", desc: "리뷰 채택률 95%" },
    ],
    recentActivity: [
      { type: "review", title: "리만 제타 함수의 함수방정식 리뷰", date: "2026-04-27" },
      { type: "proof", title: "코시-슈바르츠 부등식", date: "2026-04-23" },
    ],
  },
  {
    id: 15, name: "정해석", role: "Coq 튜토리얼 작성자", field: "미적분학 · 교육",
    proofs: 84, answers: 221, reputation: "9.7K", badge: "Educator", initial: "정",
    bio: "수학 교육과 형식 증명의 접점을 탐구합니다. Coq를 활용한 미적분학 교재를 집필 중이며, 초보자도 쉽게 접근할 수 있는 튜토리얼을 만드는 것을 목표로 합니다.",
    joinDate: "2025-05-10", languages: ["Coq", "Lean 4"],
    achievements: [
      { icon: "📚", title: "Educator", desc: "10개 이상의 튜토리얼" },
      { icon: "❤️", title: "인기 작성자", desc: "좋아요 1000개 돌파" },
    ],
    recentActivity: [
      { type: "proof", title: "미적분학의 기본정리", date: "2026-04-24" },
      { type: "tutorial", title: "Coq 입문: 자연수의 귀납법", date: "2026-04-22" },
    ],
  },
  {
    id: 16, name: "최알고", role: "자동화 도구 개발자", field: "알고리즘 · Lean tactic",
    proofs: 76, answers: 198, reputation: "8.9K", badge: "Builder", initial: "최",
    bio: "Lean 4의 tactic 시스템을 확장하는 자동화 도구를 개발합니다. 알고리즘 정확성 검증에 관심이 있으며, 컴퓨터 과학과 수학의 교차점에서 연구합니다.",
    joinDate: "2025-06-01", languages: ["Lean 4"],
    achievements: [
      { icon: "🔧", title: "Builder", desc: "커뮤니티 도구 3개 이상 개발" },
    ],
    recentActivity: [
      { type: "proof", title: "골드바흐의 추측 (작은 케이스)", date: "2026-04-25" },
    ],
  },
  {
    id: 17, name: "이정리", role: "커뮤니티 멘토", field: "논리학 · 집합론",
    proofs: 69, answers: 254, reputation: "8.1K", badge: "Mentor", initial: "이",
    bio: "논리학과 집합론을 전공하며, 형식 증명의 기초 이론에 관심이 많습니다. 초보 기여자들이 첫 증명을 완성할 수 있도록 돕고 있습니다.",
    joinDate: "2025-04-20", languages: ["Coq", "Lean 4", "Isabelle"],
    achievements: [
      { icon: "🤝", title: "Mentor", desc: "20명 이상 신규 기여자 지원" },
    ],
    recentActivity: [
      { type: "proof", title: "사칙연산의 결합법칙", date: "2026-04-26" },
    ],
  },
  {
    id: 18, name: "강기하", role: "Agda 연구 기여자", field: "타입 이론 · 기하학",
    proofs: 58, answers: 143, reputation: "6.6K", badge: "Researcher", initial: "강",
    bio: "호모토피 타입 이론(HoTT)과 기하학의 형식화를 연구합니다. Agda를 주로 사용하며, 의존 타입 시스템의 표현력을 활용한 기하학적 구조의 형식화에 집중합니다.",
    joinDate: "2025-07-15", languages: ["Agda", "Lean 4"],
    achievements: [
      { icon: "🔬", title: "Researcher", desc: "연구 기반 증명 20개 이상" },
    ],
    recentActivity: [
      { type: "proof", title: "피타고라스 정리 일반화", date: "2026-04-23" },
    ],
  },
];

export function getContributorById(id: number): Contributor | undefined {
  return contributors.find((c) => c.id === id);
}
