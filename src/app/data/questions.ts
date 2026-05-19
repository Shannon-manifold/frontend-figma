export interface QnAQuestion {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  views: number;
  answers: number;
  likes: number;
  tags: string[];
  status: "answered" | "open";
  content: string;
  answerList: { author: string; date: string; content: string; likes: number; accepted: boolean }[];
}

export const questions: QnAQuestion[] = [
  {
    id: 28,
    title: "Lean 4에서 귀납적 정의를 사용하는 방법",
    description: "자연수를 귀납적으로 정의하려고 하는데 syntax 오류가 계속 발생합니다. inductive 키워드 사용법을 알려주세요.",
    author: "김초보", date: "2026-05-08", views: 234, answers: 5, likes: 12,
    tags: ["Lean 4", "귀납법", "초보"], status: "answered",
    content: `안녕하세요, Lean 4를 처음 배우고 있는 학부생입니다.

자연수를 귀납적으로 정의하려고 하는데 계속 syntax 에러가 발생합니다.

\`\`\`lean
inductive MyNat where
  | zero : MyNat
  | succ : MyNat -> MyNat
\`\`\`

이렇게 작성하면 "unknown identifier" 오류가 나오는데, 어디가 잘못된 건지 모르겠습니다.

환경: Lean 4.3.0, VS Code + lean4 extension

어떤 도움이든 감사하겠습니다!`,
    answerList: [
      { author: "김수학", date: "2026-05-08", likes: 8, accepted: true,
        content: `코드 자체는 문법적으로 올바릅니다. 아마 몇 가지 가능한 원인이 있을 수 있어요:

1. **파일 확장자**: \`.lean\` 확장자인지 확인해주세요.
2. **lakefile 설정**: \`lakefile.lean\`에서 해당 파일이 포함되어 있는지 확인하세요.
3. **import**: 별도의 import 없이 최상위에 작성하면 됩니다.

작동하는 예시를 드릴게요:

\`\`\`lean
inductive MyNat where
  | zero : MyNat
  | succ (n : MyNat) : MyNat

#check MyNat.zero
#check MyNat.succ MyNat.zero
\`\`\`

참고로 Lean 4에서는 이미 \`Nat\` 타입이 내장되어 있으므로 학습 목적이 아니라면 기본 \`Nat\`을 사용하시는 것이 좋습니다.` },
      { author: "이정리", date: "2026-05-08", likes: 4, accepted: false,
        content: `추가로 도움이 될 자료를 알려드립니다:

- **Theorem Proving in Lean 4**: 공식 튜토리얼의 Chapter 7 "Inductive Types" 참고
- **Mathematics in Lean**: 실전 수학 증명 예제 모음
- ShannonManifold의 튜토리얼 섹션에서도 귀납법 관련 자료가 있습니다.

화이팅하세요! 🎉` },
    ],
  },
  {
    id: 29,
    title: "Coq에서 리스트 연산 증명 시 막힌 부분",
    description: "두 리스트를 concat한 결과의 길이가 각 길이의 합과 같다는 것을 증명하고 있는데, induction 후 simplify가 안됩니다.",
    author: "박증명", date: "2026-05-07", views: 189, answers: 3, likes: 8,
    tags: ["Coq", "리스트", "귀납법"], status: "answered",
    content: `Coq에서 다음 보조정리를 증명하려고 합니다:

\`\`\`coq
Lemma length_concat : forall (A : Type) (l1 l2 : list A),
  length (l1 ++ l2) = length l1 + length l2.
\`\`\`

\`induction l1\`을 적용하면 base case는 \`simpl\`로 풀리는데, inductive step에서 막힙니다.

현재 상태:
\`\`\`
IHl1 : length (l1 ++ l2) = length l1 + length l2
============================
S (length (l1 ++ l2)) = S (length l1 + length l2)
\`\`\`

여기서 어떻게 해야 하나요?`,
    answerList: [
      { author: "정해석", date: "2026-05-07", likes: 6, accepted: true,
        content: `거의 다 됐습니다! IH를 rewrite하면 됩니다:

\`\`\`coq
Proof.
  intros A l1 l2.
  induction l1 as [| a l1' IHl1].
  - simpl. reflexivity.
  - simpl. rewrite IHl1. reflexivity.
Qed.
\`\`\`

핵심은 \`rewrite IHl1\`입니다. 귀납 가설 \`IHl1\`이 \`length (l1' ++ l2) = length l1' + length l2\`를 말하고 있으므로, 목표의 \`length (l1' ++ l2)\`를 치환하면 \`S (length l1' + length l2) = S (length l1' + length l2)\`가 되어 \`reflexivity\`로 끝납니다.` },
    ],
  },
  {
    id: 30,
    title: "실수의 완비성을 Isabelle로 표현하려면?",
    description: "해석학 공부 중인데, 실수의 완비성 공리를 Isabelle/HOL에서 어떻게 표현하는지 궁금합니다.",
    author: "이해석", date: "2026-05-06", views: 312, answers: 7, likes: 19,
    tags: ["Isabelle", "해석학", "실수"], status: "answered",
    content: `해석학을 공부하면서 실수의 완비성(completeness)을 형식적으로 다루고 싶습니다.

구체적으로:
1. 데데킨트 절단을 통한 실수 구성
2. 상한(supremum)의 존재성
3. 코시 수열의 수렴성

이것들을 Isabelle/HOL에서 어떻게 표현하나요? Mathlib처럼 참고할 수 있는 라이브러리가 있을까요?`,
    answerList: [
      { author: "박증명", date: "2026-05-06", likes: 12, accepted: true,
        content: `좋은 질문입니다! Isabelle/HOL에서는 실수가 이미 잘 형식화되어 있습니다.

**1. 기본 라이브러리**: \`HOL-Analysis\`에 실수의 완비성이 포함되어 있습니다.

\`\`\`isabelle
theory MyAnalysis
  imports "HOL-Analysis.Analysis"
begin

lemma real_complete:
  fixes S :: "real set"
  assumes "S ≠ {}" and "bdd_above S"
  shows "∃x. is_Sup S x"
  using assms by (rule cSup_upper)

end
\`\`\`

**2. AFP (Archive of Formal Proofs)**: 600개 이상의 형식화된 이론이 있으며, 해석학 관련 이론도 풍부합니다.

**추천 학습 경로**: "Concrete Semantics" 교재 → HOL-Analysis 라이브러리 탐색 → AFP 기여` },
    ],
  },
  {
    id: 31,
    title: "mathlib4 업데이트 후 증명이 깨졌어요",
    description: "mathlib4를 최신 버전으로 업데이트했더니 기존에 작동하던 증명들이 에러를 냅니다.",
    author: "정개발", date: "2026-05-05", views: 445, answers: 2, likes: 15,
    tags: ["Lean 4", "mathlib", "버전관리"], status: "open",
    content: `mathlib4를 v4.6.0에서 v4.8.0으로 업데이트했더니 기존 증명들이 깨졌습니다.

주로 발생하는 에러:
- \`unknown tactic 'ring_nf'\` → 이름이 변경된 건가요?
- \`expected token ')'\` → 문법이 바뀐 건가요?
- 일부 lemma 이름이 deprecated 되었다는 warning

마이그레이션 가이드나 체계적으로 대응하는 방법이 있을까요?`,
    answerList: [
      { author: "최알고", date: "2026-05-05", likes: 7, accepted: false,
        content: `mathlib은 빠르게 발전하면서 이름 변경이 자주 발생합니다. 몇 가지 팁:

1. **\`lake update\` 후 \`lake build\`**: 전체 빌드를 다시 실행
2. **Leanprover Community 체크**: leanprover.zulipchat.com에서 breaking changes 확인
3. **\`#check\`로 이름 탐색**: deprecated된 이름의 대체 이름 찾기
4. **git bisect**: 어떤 커밋에서 깨졌는지 추적

자동 마이그레이션 도구가 있으면 좋겠는데, 아직은 수동으로 해야 합니다.` },
    ],
  },
  {
    id: 32,
    title: "함수형 프로그래밍 경험 없이 Lean 배우기",
    description: "수학 전공자인데 프로그래밍은 Python만 해봤습니다. 함수형 프로그래밍 개념 없이 Lean을 배우기 어려울까요?",
    author: "최수학", date: "2026-05-04", views: 567, answers: 11, likes: 23,
    tags: ["Lean 4", "초보", "학습방법"], status: "answered",
    content: `수학과 4학년인데 졸업 프로젝트로 형식 증명을 해보고 싶습니다.

프로그래밍은 Python으로 수치 계산 정도만 해봤고, 함수형 프로그래밍(Haskell, OCaml 등)은 전혀 경험이 없습니다.

질문:
1. 함수형 프로그래밍 기초를 먼저 배워야 할까요?
2. Lean만으로 바로 시작해도 될까요?
3. 추천하는 학습 경로가 있을까요?`,
    answerList: [
      { author: "이정리", date: "2026-05-04", likes: 15, accepted: true,
        content: `수학 전공이시면 오히려 유리한 점이 많습니다!

**1. 함수형 프로그래밍 먼저?**
아닙니다! 수학적 사고방식이 있으면 Lean에서 필요한 FP 개념은 자연스럽게 배울 수 있습니다.

**2. 추천 학습 경로:**
1. **Natural Number Game** (adam.math.hhu.de/~nevskito/natural_number_game_v4/) - 브라우저에서 바로 해볼 수 있는 인터랙티브 게임
2. **Mathematics in Lean** - 수학 전공자에게 최적화된 교재
3. **Theorem Proving in Lean 4** - 공식 교재, 나중에 참고용으로

**3. 팁:**
- 처음에는 \`sorry\`를 자유롭게 사용하고, 천천히 채워나가세요
- ShannonManifold Q&A에서 언제든 질문해주세요!` },
      { author: "김수학", date: "2026-05-04", likes: 9, accepted: false,
        content: `저도 처음에 Python만 해봤었는데 Lean을 잘 배웠습니다.

핵심 팁: **수학 증명을 쓴다고 생각하세요.** 프로그래밍이라고 생각하면 어렵지만, 수학 증명을 타이핑한다고 생각하면 훨씬 자연스럽습니다.

화이팅! 💪` },
    ],
  },
  {
    id: 33,
    title: "Agda의 dependent type과 Lean의 차이점",
    description: "Agda와 Lean 모두 dependent type을 지원하는데, 실제 사용 시 어떤 차이가 있나요?",
    author: "강타입", date: "2026-05-03", views: 298, answers: 4, likes: 16,
    tags: ["Lean 4", "Agda", "타입이론"], status: "answered",
    content: `Agda와 Lean 4 모두 의존 타입(dependent type)을 지원하는 것으로 알고 있습니다.

궁금한 점:
1. 타입 시스템 수준에서의 근본적 차이는?
2. 실제 증명 작성 시 체감되는 차이?
3. 각각이 더 적합한 사용 사례?

두 언어 모두 사용해보신 분의 경험담을 듣고 싶습니다.`,
    answerList: [
      { author: "강기하", date: "2026-05-03", likes: 11, accepted: true,
        content: `두 언어를 모두 사용해본 경험으로 답변드립니다.

**1. 근본적 차이:**
- **Agda**: 순수한 의존 타입 이론 (Martin-Löf Type Theory 기반)
- **Lean 4**: Calculus of Constructions + quotient types + proof irrelevance

**2. 실제 체감:**
- Agda는 패턴 매칭이 매우 강력하고 직관적
- Lean 4는 tactic 시스템으로 자동화가 뛰어남
- Agda는 유니버스 레벨 관리가 수동적, Lean은 자동 추론

**3. 적합한 사례:**
- **HoTT/타입 이론 연구** → Agda (cubical-agda)
- **수학 라이브러리 형식화** → Lean 4 (Mathlib)
- **프로그래밍 언어 이론** → 둘 다 좋음

개인적으로는 Lean 4의 에러 메시지와 VS Code 지원이 더 좋아서 초보자에게는 Lean을 추천합니다.` },
    ],
  },
  {
    id: 34,
    title: "위상수학 정리를 Lean으로 형식화하는 프로젝트",
    description: "학부 위상수학 교재의 주요 정리들을 Lean으로 형식화하는 프로젝트를 시작하려고 합니다.",
    author: "윤위상", date: "2026-05-02", views: 234, answers: 6, likes: 21,
    tags: ["Lean 4", "위상수학", "프로젝트"], status: "answered",
    content: `Munkres "Topology" 교재의 주요 정리들을 Lean 4로 형식화하는 프로젝트를 시작하려 합니다.

계획:
1. 위상 공간의 기본 정의 (열린 집합, 닫힌 집합, 연속 함수)
2. 연결성과 컴팩트성
3. 분리 공리 (T1, T2/하우스도르프)

질문: Mathlib에 이미 형식화된 위상수학 내용이 얼마나 있나요? 처음부터 해야 할까요?`,
    answerList: [
      { author: "김수학", date: "2026-05-02", likes: 10, accepted: true,
        content: `좋은 프로젝트 아이디어입니다!

**Mathlib의 위상수학**: 이미 상당히 많이 형식화되어 있습니다.
- \`Mathlib.Topology.Basic\`: 위상 공간, 열린/닫힌 집합
- \`Mathlib.Topology.Compactness\`: 컴팩트성
- \`Mathlib.Topology.Connected\`: 연결성
- \`Mathlib.Topology.Separation\`: 분리 공리

**추천 접근:**
처음부터 만들기보다, Mathlib의 기존 정의를 사용하면서 교재에 있지만 Mathlib에 없는 정리를 찾아 기여하는 것이 좋습니다.

Mathlib 기여 가이드를 참고하세요!` },
    ],
  },
  {
    id: 35,
    title: "tactic 작성법이 너무 어려워요",
    description: "Lean에서 반복되는 증명 패턴을 자동화하려고 custom tactic을 만들려는데, meta programming이 너무 어렵습니다.",
    author: "임메타", date: "2026-05-01", views: 178, answers: 0, likes: 5,
    tags: ["Lean 4", "tactic", "메타프로그래밍"], status: "open",
    content: `반복되는 증명 패턴이 있어서 custom tactic을 만들고 싶습니다.

예를 들어, 자연수에 대한 단순한 부등식 증명에서 항상 같은 패턴이 반복됩니다:
1. \`omega\`를 시도
2. 안 되면 \`linarith\`
3. 안 되면 \`norm_num\`

이걸 하나의 tactic으로 합치고 싶은데, \`macro\` 문법이 이해가 안 됩니다.

도움 부탁드립니다!`,
    answerList: [],
  },
];

export function getQuestionById(id: number): QnAQuestion | undefined {
  return questions.find((q) => q.id === id);
}
