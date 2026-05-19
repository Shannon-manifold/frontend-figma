export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Lean 4로 시작하는 형식 증명",
    excerpt: "현대 수학의 엄밀성을 컴퓨터로 검증하는 새로운 시대가 열렸습니다.",
    author: "김수학", date: "2026-05-01", readTime: "8분", category: "튜토리얼",
    image: "https://images.unsplash.com/photo-1754304342490-2fa390075d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYXRoZW1hdGljcyUyMGFic3RyYWN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## 형식 증명이란?

형식 증명(Formal Proof)은 수학적 명제의 증명을 컴퓨터가 검증할 수 있는 형태로 작성하는 것입니다. 전통적인 수학 증명이 자연어와 수식을 혼합하여 작성되는 반면, 형식 증명은 엄격한 논리 체계 위에서 한 단계 한 단계를 기계적으로 검증합니다.

## Lean 4 소개

Lean 4는 Microsoft Research에서 개발한 최신 증명 보조기(Proof Assistant)입니다. 함수형 프로그래밍 언어이면서 동시에 강력한 정리 증명 도구입니다.

### 주요 특징

- **의존 타입 시스템**: 타입 수준에서 수학적 명제를 표현
- **전술(Tactic) 시스템**: 직관적인 증명 작성 지원
- **메타 프로그래밍**: 사용자 정의 전술 개발 가능
- **Mathlib**: 방대한 수학 라이브러리 생태계

## 첫 번째 증명: 덧셈의 교환법칙

Lean 4에서 자연수 덧셈의 교환법칙을 증명해보겠습니다:

\`\`\`lean
theorem add_comm (n m : Nat) : n + m = m + n := by
  induction n with
  | zero => simp
  | succ n ih => simp [Nat.succ_add, ih]
\`\`\`

이 증명은 자연수에 대한 귀납법을 사용합니다. \`zero\` 케이스와 \`succ\` 케이스를 각각 처리하여 교환법칙이 모든 자연수에 대해 성립함을 보입니다.

## 왜 형식 증명인가?

1. **절대적 신뢰성**: 컴퓨터가 모든 논리적 단계를 검증
2. **재사용 가능**: 증명된 정리를 라이브러리로 축적
3. **협업**: 전 세계 수학자들이 함께 증명을 구축
4. **교육**: 증명의 각 단계를 명확히 이해

## 시작하기

Lean 4를 설치하고 첫 프로젝트를 만들어보세요. ShannonManifold 커뮤니티에서 다른 기여자들과 함께 배울 수 있습니다.`
  },
  {
    id: 2,
    title: "증명 보조기가 바꾸는 수학의 미래",
    excerpt: "인간과 기계의 협업으로 수학적 진리를 탐구합니다.",
    author: "박증명", date: "2026-04-29", readTime: "12분", category: "인사이트",
    image: "https://images.unsplash.com/photo-1758872014929-174e4ccdf01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeWluZyUyMHdhcm0lMjBsaWdodCUyMGNvZmZlZXxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## 수학의 새로운 패러다임

수학계에서 형식 검증은 더 이상 미래의 이야기가 아닙니다. Lean, Coq, Isabelle 등의 증명 보조기가 실제 수학 연구에 활발히 사용되고 있습니다.

## 주요 성과

### Liquid Tensor Experiment
Peter Scholze의 condensed mathematics 정리를 Lean으로 형식화한 프로젝트는 증명 보조기의 가능성을 전 세계에 알렸습니다.

### Mathlib
Lean 4 기반의 Mathlib은 현재 100만 줄 이상의 형식화된 수학을 포함하며, 수백 명의 기여자가 참여하고 있습니다.

## AI와 형식 증명

최근 AI 기술과 형식 증명의 결합이 활발합니다:

- **자동 증명 탐색**: AI가 증명 전략을 제안
- **자연어 → 형식 증명**: 비형식적 증명을 자동 형식화
- **오류 탐지**: 기존 논문에서 논리적 허점 발견

## 커뮤니티의 역할

ShannonManifold와 같은 커뮤니티 플랫폼은 형식 증명의 대중화에 핵심적인 역할을 합니다. 개인 연구자가 혼자 할 수 없는 대규모 형식화 프로젝트를 협업으로 완성할 수 있습니다.`
  },
  {
    id: 3,
    title: "Coq vs Lean: 어떤 증명 보조기를 선택할까?",
    excerpt: "각 증명 보조기의 특징과 장단점을 비교 분석합니다.",
    author: "이정리", date: "2026-04-27", readTime: "10분", category: "비교 분석",
    image: "https://images.unsplash.com/photo-1765408217678-545de3e8941d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYXRoZW1hdGljcyUyMGFic3RyYWN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## 개요

증명 보조기를 처음 시작할 때 가장 많이 받는 질문 중 하나가 "어떤 도구를 써야 하나요?"입니다. 이 글에서는 Coq와 Lean을 여러 기준으로 비교합니다.

## Coq

### 장점
- **40년의 역사**: 풍부한 문서와 학술 자료
- **Program Extraction**: 증명에서 실행 가능한 프로그램 추출
- **강력한 전술 언어**: Ltac2 등 고급 전술 시스템

### 단점
- 학습 곡선이 다소 가파름
- 최신 수학 라이브러리가 Lean에 비해 적음

## Lean 4

### 장점
- **현대적 설계**: 함수형 프로그래밍과 자연스러운 통합
- **Mathlib**: 방대하고 활발한 수학 라이브러리
- **VS Code 지원**: 뛰어난 개발 환경

### 단점
- 상대적으로 젊은 생태계
- 버전 간 호환성 이슈 (빠른 발전 중)

## 결론

| 기준 | Coq | Lean 4 |
|------|-----|--------|
| 학습 자료 | ★★★★★ | ★★★★☆ |
| 수학 라이브러리 | ★★★☆☆ | ★★★★★ |
| 커뮤니티 활성도 | ★★★★☆ | ★★★★★ |
| 프로그래밍 통합 | ★★★★☆ | ★★★★★ |

수학 연구 목적이라면 Lean 4 + Mathlib을, 소프트웨어 검증 목적이라면 Coq를 추천합니다.`
  },
  {
    id: 4,
    title: "페르마의 마지막 정리, 컴퓨터로 검증하다",
    excerpt: "350년간 미해결이었던 난제가 어떻게 형식 증명으로 재탄생했는지 그 여정을 따라갑니다.",
    author: "정해석", date: "2026-04-25", readTime: "15분", category: "케이스 스터디",
    image: "https://images.unsplash.com/photo-1754304342453-927ae7740b99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxtYXRoZW1hdGljcyUyMGFic3RyYWN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## 350년의 여정

1637년, 피에르 드 페르마는 자신의 책 여백에 "놀라운 증명을 발견했으나 여백이 부족하다"고 적었습니다. 이후 358년간 수많은 수학자들이 도전한 끝에, 1995년 앤드류 와일스가 마침내 증명에 성공했습니다.

## 와일스의 증명

와일스의 증명은 100페이지가 넘는 방대한 논문으로, 모듈러 형식과 타원 곡선의 깊은 연결을 활용합니다. 이 증명의 정확성을 검증하는 것은 소수의 전문가만이 가능한 작업이었습니다.

## 형식 검증의 도전

현재 Lean 커뮤니티에서는 FLT(Fermat's Last Theorem)의 완전한 형식화를 목표로 프로젝트가 진행 중입니다:

1. **기초 정수론**: 자연수, 정수, 유리수의 기본 성질
2. **대수적 정수론**: 수체, 이데알, 데데킨트 환
3. **타원 곡선**: 모듈러성 정리의 핵심
4. **오토모르픽 형식**: 갈루아 표현과의 연결

## n=3인 경우

우리 커뮤니티에서 완성한 n=3 케이스는 이 거대한 프로젝트의 첫 걸음입니다. 오일러가 처음 증명한 이 특수한 경우를 Lean 4로 형식화하였습니다.

## 참여하기

FLT 형식화 프로젝트에 참여하고 싶다면, ShannonManifold의 정수론 채널에서 진행 상황을 확인할 수 있습니다.`
  },
  {
    id: 5,
    title: "커뮤니티와 함께 성장하는 ShannonManifold",
    excerpt: "지난 1년간 ShannonManifold 커뮤니티의 성장 과정과 앞으로의 비전을 공유합니다.",
    author: "최알고", date: "2026-04-22", readTime: "6분", category: "커뮤니티",
    image: "https://images.unsplash.com/photo-1758270705317-3ef6142d306f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwcGVvcGxlfGVufDF8fHx8MTc3NzUxNzMwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## 1년의 성장

ShannonManifold은 출범 1년 만에 놀라운 성장을 이루었습니다.

### 주요 지표
- **기여자**: 12명 → 892명
- **검증된 증명**: 23개 → 1,247개
- **커뮤니티 답변**: 156개 → 2,134개

## 성공 요인

1. **낮은 진입 장벽**: 초보자도 쉽게 시작할 수 있는 튜토리얼
2. **멘토링 시스템**: 경험 많은 기여자가 신규 기여자를 지원
3. **품질 관리**: 증명 보조기를 통한 자동 검증
4. **인정과 보상**: 배지, 평판 시스템으로 기여 동기 부여

## 앞으로의 비전

- **난제 후원 시스템**: 미해결 문제에 대한 크라우드 펀딩
- **AI 보조 증명**: AI가 증명 힌트를 제공하는 기능
- **교육 과정**: 형식 증명 입문부터 고급까지 체계적 커리큘럼
- **국제 협업**: 전 세계 대학 및 연구소와의 파트너십`
  },
  {
    id: 6,
    title: "Isabelle/HOL 입문 가이드",
    excerpt: "HOL 기반의 강력한 증명 보조기 Isabelle을 처음 시작하는 분들을 위한 완벽 가이드입니다.",
    author: "강기하", date: "2026-04-20", readTime: "11분", category: "튜토리얼",
    image: "https://images.unsplash.com/photo-1754304342501-54bad0a6d195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYXRoZW1hdGljcyUyMGFic3RyYWN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3Nzc1MTczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: `## Isabelle/HOL이란?

Isabelle은 Cambridge 대학과 TU München에서 개발한 범용 증명 보조기입니다. HOL(Higher-Order Logic)은 Isabelle에서 가장 널리 사용되는 논리 체계입니다.

## 설치

Isabelle은 독립 실행형 IDE(Isabelle/jEdit)를 제공합니다:
1. isabelle.in.tum.de에서 다운로드
2. 압축 해제 후 실행
3. 별도의 패키지 관리자 불필요

## 첫 번째 이론 파일

\`\`\`isabelle
theory MyFirst
  imports Main
begin

theorem add_comm: "(a::nat) + b = b + a"
  by (induct a) auto

end
\`\`\`

## Isabelle의 강점

- **자동화**: \`auto\`, \`simp\`, \`blast\` 등 강력한 자동 증명 전술
- **Sledgehammer**: 외부 ATP를 활용한 자동 증명 탐색
- **문서화**: Isar 증명 언어로 읽기 쉬운 증명 작성 가능
- **Archive of Formal Proofs**: 600개 이상의 형식화된 이론

## 추천 학습 경로

1. "Concrete Semantics" 교재로 기초 학습
2. Archive of Formal Proofs 읽기
3. ShannonManifold에서 실전 증명 기여`
  },
];

export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find((p) => p.id === id);
}
