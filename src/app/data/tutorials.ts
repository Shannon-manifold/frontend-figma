export interface TutorialStep {
  title: string;
  description: string;
  explanation: string;
  starterCode: string;
  solution: string;
  hint: string;
}

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  icon: string;
  author: string;
  updatedAt: string;
  prerequisites: string[];
  tags: string[];
  steps: TutorialStep[];
}

export const tutorials: Tutorial[] = [
  {
    id: 36,
    title: "수리논리 및 집합론",
    description: "명제 논리, 술어 논리, 집합의 기본 개념과 연산을 배우고 Lean으로 증명합니다.",
    level: "Beginner", duration: "4주", lessons: 12, icon: "∀",
    author: "이정리", updatedAt: "2026-04-15",
    prerequisites: [],
    tags: ["Lean 4", "논리학", "집합론"],
    steps: [
      {
        title: "명제와 진리값",
        description: "Lean에서 명제를 정의하고 진리값을 확인하는 방법을 배웁니다.",
        explanation: "명제는 참 또는 거짓으로 판단할 수 있는 문장입니다. Lean에서는 Prop 타입으로 표현됩니다.",
        starterCode: "-- 명제 P와 Q를 정의하세요\nvariable (P Q : Prop)\n\n-- P와 Q의 논리곱을 증명하세요\nexample (hP : P) (hQ : Q) : P ∧ Q := by\n  -- 여기에 증명을 작성하세요\n  sorry",
        solution: "variable (P Q : Prop)\n\nexample (hP : P) (hQ : Q) : P ∧ Q := by\n  constructor\n  exact hP\n  exact hQ",
        hint: "constructor 전술을 사용하면 논리곱을 두 개의 목표로 나눌 수 있습니다.",
      },
      {
        title: "함의와 추론",
        description: "명제 간의 함의 관계를 이해하고 증명합니다.",
        explanation: "P → Q는 \"P이면 Q이다\"를 의미합니다. 이를 증명하려면 P를 가정하고 Q를 도출해야 합니다.",
        starterCode: "variable (P Q R : Prop)\n\n-- 삼단논법을 증명하세요\nexample (h1 : P → Q) (h2 : Q → R) : P → R := by\n  sorry",
        solution: "variable (P Q R : Prop)\n\nexample (h1 : P → Q) (h2 : Q → R) : P → R := by\n  intro hP\n  apply h2\n  apply h1\n  exact hP",
        hint: "intro 전술로 P를 가정하고, apply를 사용해 가설을 적용하세요.",
      },
      {
        title: "부정과 모순",
        description: "부정 명제와 모순을 다루는 방법을 학습합니다.",
        explanation: "¬P는 \"P가 아니다\"를 의미하며, P → False로 정의됩니다.",
        starterCode: "variable (P : Prop)\n\n-- 이중 부정 제거를 증명하세요\nexample (h : ¬¬P) : P := by\n  sorry",
        solution: "variable (P : Prop)\n\nexample (h : ¬¬P) : P := by\n  by_contra hnP\n  exact h hnP",
        hint: "by_contra 전술을 사용하면 귀류법으로 증명할 수 있습니다.",
      },
    ],
  },
  {
    id: 37,
    title: "해석학",
    description: "실수의 완비성, 수열의 극한, 연속함수, 미분과 적분의 엄밀한 정의를 학습합니다.",
    level: "Intermediate", duration: "6주", lessons: 18, icon: "∫",
    author: "박증명", updatedAt: "2026-04-20",
    prerequisites: ["logic-set-theory"],
    tags: ["Lean 4", "해석학", "실수"],
    steps: [
      {
        title: "실수의 완비성",
        description: "실수 체계의 완비성 공리를 이해합니다.",
        explanation: "모든 상한이 존재하는 비어있지 않은 실수 집합은 최소 상한을 가집니다.",
        starterCode: "import Mathlib.Data.Real.Basic\n\nsorry",
        solution: "import Mathlib.Data.Real.Basic\n\ntheorem sup_example : ∃ x : ℝ, ∀ y : ℝ, y ≤ x := by\n  sorry",
        hint: "실수의 완비성은 Mathlib에서 제공하는 공리를 사용합니다.",
      },
    ],
  },
  {
    id: 38,
    title: "선형대수학",
    description: "벡터 공간, 선형 변환, 고유값과 고유벡터를 형식적으로 증명하는 방법을 배웁니다.",
    level: "Intermediate", duration: "5주", lessons: 15, icon: "⊕",
    author: "김수학", updatedAt: "2026-04-10",
    prerequisites: ["logic-set-theory"],
    tags: ["Lean 4", "선형대수", "벡터 공간"],
    steps: [
      {
        title: "벡터 공간의 정의",
        description: "벡터 공간의 공리를 Lean으로 표현합니다.",
        explanation: "벡터 공간은 벡터의 덧셈과 스칼라 곱셈이 정의된 집합입니다.",
        starterCode: "import Mathlib.LinearAlgebra.Basic\n\nsorry",
        solution: "import Mathlib.LinearAlgebra.Basic\n\n-- 벡터 공간 예제",
        hint: "Mathlib의 LinearAlgebra 모듈을 참고하세요.",
      },
    ],
  },
  {
    id: 39,
    title: "위상수학",
    description: "위상 공간, 연속성, 컴팩트성, 연결성 등 위상수학의 기초 개념을 증명 보조기로 탐구합니다.",
    level: "Advanced", duration: "8주", lessons: 24, icon: "∞",
    author: "정해석", updatedAt: "2026-04-05",
    prerequisites: ["analysis"],
    tags: ["Lean 4", "위상수학", "연속성"],
    steps: [
      {
        title: "위상 공간의 정의",
        description: "열린 집합을 통한 위상 공간의 정의를 학습합니다.",
        explanation: "위상 공간은 열린 집합의 모임이 특정 공리를 만족하는 집합입니다.",
        starterCode: "import Mathlib.Topology.Basic\n\nsorry",
        solution: "import Mathlib.Topology.Basic\n\n-- 위상 공간 예제",
        hint: "Mathlib.Topology.Basic을 import하여 기본 정의를 사용하세요.",
      },
    ],
  },
  {
    id: 40,
    title: "추상대수학",
    description: "군, 환, 체의 구조와 성질을 형식적으로 정의하고 증명하는 과정을 학습합니다.",
    level: "Advanced", duration: "7주", lessons: 21, icon: "⊗",
    author: "최알고", updatedAt: "2026-03-28",
    prerequisites: ["linear-algebra"],
    tags: ["Lean 4", "군론", "환론"],
    steps: [
      {
        title: "군의 정의",
        description: "군의 공리를 Lean으로 표현하고 기본 성질을 증명합니다.",
        explanation: "군은 결합법칙, 항등원, 역원이 존재하는 대수적 구조입니다.",
        starterCode: "import Mathlib.GroupTheory.Basic\n\nsorry",
        solution: "import Mathlib.GroupTheory.Basic\n\n-- 군의 기본 성질",
        hint: "Mathlib.GroupTheory를 참고하세요.",
      },
    ],
  },
  {
    id: 41,
    title: "정수론",
    description: "소수, 합동, 디오판토스 방정식 등 정수의 성질을 컴퓨터로 검증하며 배웁니다.",
    level: "Intermediate", duration: "5주", lessons: 15, icon: "ℤ",
    author: "김수학", updatedAt: "2026-04-12",
    prerequisites: ["logic-set-theory"],
    tags: ["Lean 4", "정수론", "소수"],
    steps: [
      {
        title: "소수의 정의",
        description: "소수의 정의와 기본 성질을 형식화합니다.",
        explanation: "소수는 1보다 크고 1과 자기 자신만을 약수로 가지는 자연수입니다.",
        starterCode: "import Mathlib.Data.Nat.Prime\n\nsorry",
        solution: "import Mathlib.Data.Nat.Prime\n\n-- 소수 관련 정리",
        hint: "Mathlib.Data.Nat.Prime에서 소수 관련 정리를 찾을 수 있습니다.",
      },
    ],
  },
];

export function getTutorialById(id: number): Tutorial | undefined {
  return tutorials.find((t) => t.id === id);
}
