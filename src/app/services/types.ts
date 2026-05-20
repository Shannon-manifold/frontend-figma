export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
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

export interface BlogResponse {
  id: number;
  title: string;
  content: string;
  summary: string;
  authorName: string;
  createdAt: string;
}
