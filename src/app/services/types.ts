export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  nickname: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  preferredSystem?: string | null;
  joinDate?: string;
  role: 'member' | 'moderator' | 'admin';
  statProofs?: number;
  statAnswers?: number;
  statLikes?: number;
  statPoints?: number;
  notiEmail?: boolean;
  notiAnswer?: boolean;
  notiLike?: boolean;
  notiChallenge?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  badge: string;
  initial: string;
  field: string;
  proofs: number;
  answers: number;
  reputation: string;
  joinDate: string;
  bio: string;
  languages: string[];
  achievements: {
    icon: string;
    title: string;
    desc: string;
  }[];
  recentActivity: {
    type: string;
    title: string;
    date: string;
  }[];
}

export interface ProofResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  prover: string;
  language: string;
  likes: number;
  comments: number;
  date: string;
}

export interface ProofDetailResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  proverId: number;
  proverName: string;
  language: string;
  likes: number;
  commentsCount: number;
  date: string;
  field: string;
  latex: string;
  code: string;
}

export interface TutorialResponse {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessonsCount: number;
  icon: string;
  authorName: string;
  tagsJson: string;
}

export interface TutorialStepResponse {
  id: number;
  stepOrder: number;
  title: string;
  description: string;
  explanation: string;
  starterCode: string;
  solution: string;
  hint: string;
}

export interface TutorialDetailResponse {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessonsCount: number;
  icon: string;
  authorId: number;
  authorName: string;
  updatedAt: string;
  prerequisitesJson: string;
  tagsJson: string;
  steps: TutorialStepResponse[];
}

export interface BlogPostResponse {
  id: number;
  title: string;
  excerpt: string;
  authorName: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export interface BlogPostDetailResponse {
  id: number;
  title: string;
  excerpt: string;
  authorId: number;
  authorName: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  content: string;
}

export interface AnswerResponse {
  id: number;
  questionId: number;
  authorId: number;
  authorName: string;
  date: string;
  content: string;
  likes: number;
  accepted: boolean;
}

export interface QuestionResponse {
  id: number;
  title: string;
  description: string;
  authorName: string;
  date: string;
  views: number;
  answersCount: number;
  likes: number;
  status: 'answered' | 'open';
  tags: string[];
}

export interface QuestionDetailResponse {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  date: string;
  views: number;
  answersCount: number;
  likes: number;
  status: 'answered' | 'open';
  content: string;
  tags: string[];
  answers: AnswerResponse[];
}

export interface ChallengeResponse {
  id: number;
  title: string;
  field: string;
  description: string;
  prize: string;
  sponsorPool: string;
  backers: number;
  progress: number;
  difficulty: 'MILLENNIUM' | 'HARD' | 'MEDIUM' | 'EASY';
  proofSystem: string;
  accent: string;
}

export interface ChallengeDetailResponse {
  id: number;
  title: string;
  field: string;
  description: string;
  prize: string;
  sponsorPool: string;
  backers: number;
  progress: number;
  difficulty: 'MILLENNIUM' | 'HARD' | 'MEDIUM' | 'EASY';
  proofSystem: string;
  accent: string;
  detailedDescription: string;
  references?: { [key: string]: string }[];
}

export interface NotificationResponse {
  id: number;
  type: 'verified' | 'answer' | 'like' | 'challenge';
  title: string;
  message: string;
  targetType?: string;
  targetId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface CommentResponse {
  id: number;
  proofId: number;
  authorId: number;
  authorName: string;
  content: string;
  date: string;
}

export interface VerifyResponse {
  verified: boolean;
  output: string;
}

