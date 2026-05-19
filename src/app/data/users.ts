export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
  system: string;                 // 주 사용 증명 보조기
  joinDate: string;
  role: "member" | "moderator" | "admin";
  stats: {
    proofs: number;
    answers: number;
    likes: number;
    points: number;
  };
  notifications: {
    email: boolean;
    answer: boolean;
    like: boolean;
    challenge: boolean;
  };
}

export interface UserProof {
  id: number;
  title: string;
  system: string;
  status: "verified" | "pending" | "rejected";
  likes: number;
  comments: number;
  date: string;
}

export interface UserQnAActivity {
  id: number;
  type: "question" | "answer";
  title: string;
  answers?: number;
  views?: number;
  answered?: string;
  date: string;
  solved: boolean;
}

export interface UserBookmark {
  id: number;
  title: string;
  author: string;
  system: string;
  likes: number;
  date: string;
  targetType: "proof" | "blog" | "question";
  targetId: number;
}

/* ─── mock current user ─── */

export const currentUser: UserProfile = {
  id: 42,
  name: "테스트",
  email: "test@shannonmanifold.io",
  avatarUrl: null,
  bio: "수학의 엄밀성을 코드로 증명합니다.",
  system: "Lean 4",
  joinDate: "2026-01-15",
  role: "member",
  stats: { proofs: 12, answers: 34, likes: 128, points: 2450 },
  notifications: { email: true, answer: true, like: false, challenge: true },
};

export const userProofs: UserProof[] = [
  { id: 43, title: "페르마의 소정리 (Lean 4)", system: "Lean 4", status: "verified", likes: 24, comments: 6, date: "2026-04-12" },
  { id: 44, title: "힐베르트 공간의 완비성", system: "Lean 4", status: "verified", likes: 17, comments: 3, date: "2026-03-28" },
  { id: 45, title: "체비쇼프 부등식", system: "Lean 4", status: "pending", likes: 5, comments: 1, date: "2026-05-02" },
  { id: 46, title: "리만 적분 가능 조건", system: "Lean 4", status: "verified", likes: 31, comments: 9, date: "2026-02-15" },
];

export const userQnAActivities: UserQnAActivity[] = [
  { id: 47, type: "question", title: "Lean 4에서 nat.rec 없이 귀납법을 쓸 수 있나요?", answers: 3, views: 142, date: "2026-04-20", solved: true },
  { id: 48, type: "answer", title: "Coq에서 dependent type을 다루는 방법", answered: "내 답변이 채택됨", date: "2026-04-08", solved: true },
  { id: 49, type: "question", title: "Agda의 with 패턴과 case split 차이", answers: 1, views: 67, date: "2026-05-01", solved: false },
  { id: 50, type: "answer", title: "setoid rewriting in Lean 4", answered: "답변함", date: "2026-03-15", solved: false },
];

export const userBookmarks: UserBookmark[] = [
  { id: 51, title: "연속 함수의 극값 정리", author: "mathproof_kr", system: "Isabelle", likes: 89, date: "2026-04-05", targetType: "proof", targetId: 54 },
  { id: 52, title: "유한군의 라그랑주 정리", author: "lean_alice", system: "Lean 4", likes: 201, date: "2026-03-22", targetType: "proof", targetId: 55 },
  { id: 53, title: "Cantor-Schroeder-Bernstein", author: "coq_master", system: "Coq", likes: 156, date: "2026-02-28", targetType: "proof", targetId: 56 },
];
