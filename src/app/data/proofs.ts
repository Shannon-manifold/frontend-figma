export interface Proof {
  id: number;
  title: string;
  description: string;
  status: 'verified' | 'pending' | 'failed';
  prover: string;
  language: string;
  likes: number;
  comments: number;
  date: string;
  field: string;
  latex: string;
  code?: string;
}

export const proofs: Proof[] = [
  {
    id: 19,
    title: "페르마의 마지막 정리 (n=3)",
    description: "n이 3일 때 x³ + y³ = z³을 만족하는 양의 정수 해가 존재하지 않음을 증명",
    status: "verified",
    prover: "김수학",
    language: "Lean 4",
    likes: 247,
    comments: 32,
    date: "2026-04-28",
    field: "정수론",
    code: `theorem fermat_last_n3 :
  ∀ x y z : ℕ, x > 0 → y > 0 → z > 0 →
    x ^ 3 + y ^ 3 ≠ z ^ 3 := by
  intro x y z hx hy hz
  -- Proof by infinite descent
  sorry`,
    latex: `\\section*{페르마의 마지막 정리 ($n=3$)}

\\textbf{정리.} 방정식 $x^3 + y^3 = z^3$은 양의 정수 해를 갖지 않는다.

\\begin{proof}
무한 강하법(Infinite Descent)을 사용한다.

\\textbf{1단계: 가정}

양의 정수 $x, y, z$가 $x^3 + y^3 = z^3$을 만족한다고 가정하자.
$\\gcd(x, y) = 1$로 놓을 수 있다 (공약수로 나눌 수 있으므로).

\\textbf{2단계: 인수분해}

$\\omega = e^{2\\pi i/3}$을 원시 3차 단위근이라 하면,
$$x^3 + y^3 = (x + y)(x + \\omega y)(x + \\omega^2 y) = z^3$$

\\textbf{3단계: 아이디얼 분석}

$\\mathbb{Z}[\\omega]$에서 위 세 인수는 쌍마다 서로소이다.
유일 인수분해 성질에 의해, 각 인수는 단원을 제외하고 세제곱이다:
$$x + y = \\alpha^3, \\quad x + \\omega y = \\beta^3, \\quad x + \\omega^2 y = \\gamma^3$$

\\textbf{4단계: 강하}

위로부터 $|\\alpha|^2 + |\\beta|^2 < z$인 더 작은 해를 구성할 수 있다.
이는 양의 정수의 감소 열이 무한히 계속될 수 없다는 사실에 모순이다.

따라서 원래 방정식은 양의 정수 해를 갖지 않는다. \\qed
\\end{proof}`
  },
  {
    id: 20,
    title: "리만 제타 함수의 함수방정식",
    description: "리만 제타 함수 ζ(s)가 만족하는 함수방정식을 형식적으로 증명",
    status: "verified",
    prover: "박증명",
    language: "Isabelle",
    likes: 189,
    comments: 24,
    date: "2026-04-27",
    field: "해석학",
    latex: `\\section*{리만 제타 함수의 함수방정식}

\\textbf{정리.} 리만 제타 함수 $\\zeta(s)$는 다음 함수방정식을 만족한다:
$$\\zeta(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s)\\, \\zeta(1-s)$$

\\begin{proof}

\\textbf{1단계: 감마 함수와의 관계}

$\\text{Re}(s) > 1$일 때, 감마 함수의 적분 표현을 이용하면:
$$\\pi^{-s/2} \\Gamma\\!\\left(\\frac{s}{2}\\right) \\zeta(s) = \\int_0^\\infty x^{s/2 - 1} \\psi(x)\\, dx$$
여기서 $\\psi(x) = \\sum_{n=1}^{\\infty} e^{-\\pi n^2 x}$는 야코비 세타 함수의 변환이다.

\\textbf{2단계: 멜린 변환의 분리}

적분을 $[0,1]$과 $[1,\\infty)$로 분리하고, $\\psi$의 변환 공식
$$\\psi(x) = \\frac{1}{\\sqrt{x}} \\psi\\!\\left(\\frac{1}{x}\\right) + \\frac{1}{2\\sqrt{x}} - \\frac{1}{2}$$
을 적용하면:

$$\\xi(s) = \\pi^{-s/2} \\Gamma\\!\\left(\\frac{s}{2}\\right) \\zeta(s) = \\frac{1}{s(s-1)} + \\int_1^\\infty \\left(x^{s/2-1} + x^{(1-s)/2-1}\\right) \\psi(x)\\, dx$$

\\textbf{3단계: 대칭성}

위 표현에서 $\\xi(s) = \\xi(1-s)$가 성립함을 바로 확인할 수 있다.

이를 풀면 원하는 함수방정식을 얻는다. \\qed
\\end{proof}`
  },
  {
    id: 21,
    title: "사칙연산의 결합법칙",
    description: "자연수 집합에서 덧셈과 곱셈의 결합법칙을 귀납법으로 증명",
    status: "verified",
    prover: "이정리",
    language: "Coq",
    likes: 156,
    comments: 18,
    date: "2026-04-26",
    field: "대수학",
    latex: `\\section*{사칙연산의 결합법칙}

\\textbf{정리.} 모든 자연수 $a, b, c$에 대해:
$$(a + b) + c = a + (b + c)$$

\\begin{proof}
$c$에 대한 수학적 귀납법으로 증명한다.

\\textbf{기본 단계} ($c = 0$):
$$(a + b) + 0 = a + b = a + (b + 0)$$
덧셈의 항등원 성질에 의해 성립한다.

\\textbf{귀납 단계:}

$(a + b) + c = a + (b + c)$가 성립한다고 가정하자 (귀납 가설).

\\begin{align*}
(a + b) + S(c) &= S((a + b) + c) && \\text{(후속자 정의)} \\\\
&= S(a + (b + c)) && \\text{(귀납 가설)} \\\\
&= a + S(b + c) && \\text{(후속자 정의)} \\\\
&= a + (b + S(c)) && \\text{(후속자 정의)}
\\end{align*}

따라서 수학적 귀납법에 의해 모든 자연수에서 결합법칙이 성립한다. \\qed
\\end{proof}`
  },
  {
    id: 22,
    title: "골드바흐의 추측 (작은 케이스)",
    description: "10^8 이하의 모든 짝수는 두 소수의 합으로 표현됨을 컴퓨터 검증",
    status: "pending",
    prover: "최알고",
    language: "Lean 4",
    likes: 312,
    comments: 67,
    date: "2026-04-25",
    field: "정수론",
    latex: `\\section*{골드바흐의 추측 (작은 케이스)}

\\textbf{추측 (골드바흐, 1742).} 2보다 큰 모든 짝수 정수는 두 소수의 합으로 표현될 수 있다.

\\textbf{정리 (컴퓨터 검증).} $4 \\le n \\le 10^8$인 모든 짝수 $n$에 대해, 소수 $p, q$가 존재하여 $n = p + q$이다.

\\begin{proof}
에라토스테네스의 체를 이용한 전수 검사로 증명한다.

\\textbf{알고리즘:}
\\begin{enumerate}
  \\item $10^8$ 이하의 모든 소수를 에라토스테네스의 체로 생성한다.
  \\item 각 짝수 $n = 4, 6, 8, \\ldots, 10^8$에 대해:
  \\begin{itemize}
    \\item $p = 2$부터 $p \\le n/2$인 소수 $p$를 순회
    \\item $n - p$도 소수인지 확인
    \\item 발견 시 다음 $n$으로 이동
  \\end{itemize}
  \\item 모든 짝수에 대해 분해가 성공함을 확인
\\end{enumerate}

\\textbf{결과:} 약 $5 \\times 10^7$개의 짝수 모두에서 골드바흐 분해가 존재함을 확인하였다.

\\textbf{참고:} 이것은 유한 범위의 컴퓨터 검증이며, 일반적인 증명은 아직 미해결 상태이다.
\\end{proof}`
  },
  {
    id: 23,
    title: "미적분학의 기본정리",
    description: "연속함수의 적분과 미분이 서로 역연산임을 증명",
    status: "verified",
    prover: "정해석",
    language: "Coq",
    likes: 203,
    comments: 29,
    date: "2026-04-24",
    field: "해석학",
    latex: `\\section*{미적분학의 기본정리}

\\textbf{정리 (제1 기본정리).} $f$가 $[a,b]$에서 연속이면, 함수
$$F(x) = \\int_a^x f(t)\\, dt$$
는 $(a,b)$에서 미분 가능하고 $F'(x) = f(x)$이다.

\\begin{proof}

임의의 $x \\in (a,b)$와 $h \\ne 0$에 대해:

$$\\frac{F(x+h) - F(x)}{h} = \\frac{1}{h} \\int_x^{x+h} f(t)\\, dt$$

$f$가 $x$에서 연속이므로, 임의의 $\\varepsilon > 0$에 대해 $\\delta > 0$가 존재하여
$|t - x| < \\delta$이면 $|f(t) - f(x)| < \\varepsilon$이다.

$|h| < \\delta$일 때:
\\begin{align*}
\\left| \\frac{F(x+h) - F(x)}{h} - f(x) \\right|
&= \\left| \\frac{1}{h} \\int_x^{x+h} [f(t) - f(x)]\\, dt \\right| \\\\
&\\le \\frac{1}{|h|} \\int_x^{x+h} |f(t) - f(x)|\\, dt \\\\
&< \\frac{1}{|h|} \\cdot |h| \\cdot \\varepsilon = \\varepsilon
\\end{align*}

따라서 $F'(x) = \\lim_{h \\to 0} \\dfrac{F(x+h) - F(x)}{h} = f(x)$. \\qed
\\end{proof}`
  },
  {
    id: 24,
    title: "피타고라스 정리 일반화",
    description: "n차원 공간에서의 피타고라스 정리 확장 증명",
    status: "failed",
    prover: "강기하",
    language: "Agda",
    likes: 98,
    comments: 45,
    date: "2026-04-23",
    field: "기하학",
    latex: `\\section*{피타고라스 정리 일반화}

\\textbf{정리.} $\\mathbb{R}^n$의 직교 벡터 $v_1, v_2, \\ldots, v_k$에 대해:
$$\\left\\| \\sum_{i=1}^k v_i \\right\\|^2 = \\sum_{i=1}^k \\| v_i \\|^2$$

\\begin{proof}
내적의 쌍선형성을 이용한다.

$$\\left\\| \\sum_{i=1}^k v_i \\right\\|^2 = \\left\\langle \\sum_{i=1}^k v_i,\\, \\sum_{j=1}^k v_j \\right\\rangle = \\sum_{i=1}^k \\sum_{j=1}^k \\langle v_i, v_j \\rangle$$

$v_i \\perp v_j$ ($i \\ne j$)이므로 $\\langle v_i, v_j \\rangle = 0$이다.

따라서:
$$\\sum_{i=1}^k \\sum_{j=1}^k \\langle v_i, v_j \\rangle = \\sum_{i=1}^k \\langle v_i, v_i \\rangle = \\sum_{i=1}^k \\| v_i \\|^2$$

\\textbf{참고:} $k=2$, $n=2$인 경우 고전적인 피타고라스 정리 $a^2 + b^2 = c^2$을 복원한다.

\\textbf{검증 실패 사유:} Agda 타입 체커에서 내적 공리의 형식화 과정에서 유니버스 레벨 불일치가 발생하였다. 수정 후 재검증 예정.
\\end{proof}`
  },
  {
    id: 25,
    title: "유클리드 호제법의 정당성",
    description: "최대공약수를 구하는 유클리드 알고리즘의 정확성 증명",
    status: "verified",
    prover: "윤정수",
    language: "Lean 4",
    likes: 178,
    comments: 21,
    date: "2026-04-22",
    field: "정수론",
    latex: `\\section*{유클리드 호제법의 정당성}

\\textbf{정리.} $a, b \\in \\mathbb{N}$, $b > 0$이면:
$$\\gcd(a, b) = \\gcd(b, a \\bmod b)$$

\\begin{proof}

$d = \\gcd(a, b)$로 놓자. $a = bq + r$ ($r = a \\bmod b$)로 쓸 수 있다.

\\textbf{($d \\mid \\gcd(b, r)$):}
$d \\mid a$이고 $d \\mid b$이므로 $d \\mid (a - bq) = r$이다.
따라서 $d$는 $b$와 $r$의 공약수이고, $d \\mid \\gcd(b, r)$.

\\textbf{($\\gcd(b, r) \\mid d$):}
$d' = \\gcd(b, r)$로 놓으면, $d' \\mid b$이고 $d' \\mid r$이므로
$d' \\mid (bq + r) = a$이다.
따라서 $d'$는 $a$와 $b$의 공약수이고, $d' \\mid d$.

$d \\mid \\gcd(b,r)$이고 $\\gcd(b,r) \\mid d$이므로 $\\gcd(a,b) = \\gcd(b, r)$. \\qed
\\end{proof}`
  },
  {
    id: 26,
    title: "베르누이 수의 재귀 정의",
    description: "베르누이 수를 재귀적으로 정의하고 주요 성질 증명",
    status: "verified",
    prover: "임조합",
    language: "Isabelle",
    likes: 145,
    comments: 15,
    date: "2026-04-21",
    field: "조합론",
    latex: `\\section*{베르누이 수의 재귀 정의}

\\textbf{정의.} 베르누이 수 $B_n$은 다음 재귀식으로 정의된다:
$$\\sum_{k=0}^{n} \\binom{n+1}{k} B_k = 0 \\quad (n \\ge 1), \\qquad B_0 = 1$$

\\textbf{정리.} 위 재귀식의 처음 몇 값은 다음과 같다:
$$B_0 = 1, \\quad B_1 = -\\frac{1}{2}, \\quad B_2 = \\frac{1}{6}, \\quad B_3 = 0, \\quad B_4 = -\\frac{1}{30}$$

\\begin{proof}
재귀식을 순서대로 적용한다.

\\textbf{$n=1$:} $\\binom{2}{0}B_0 + \\binom{2}{1}B_1 = 0$이므로 $1 + 2B_1 = 0$, 즉 $B_1 = -\\frac{1}{2}$.

\\textbf{$n=2$:} $\\binom{3}{0}B_0 + \\binom{3}{1}B_1 + \\binom{3}{2}B_2 = 0$에서
$$1 + 3\\left(-\\frac{1}{2}\\right) + 3B_2 = 0 \\implies B_2 = \\frac{1}{6}$$

\\textbf{$n \\ge 3$ 홀수에 대한 성질:} $n \\ge 3$인 홀수에 대해 $B_n = 0$임이 알려져 있으며,
이는 생성함수 $\\frac{t}{e^t - 1} + \\frac{t}{2}$가 우함수임에서 따른다. \\qed
\\end{proof}`
  },
  {
    id: 27,
    title: "스털링 공식의 점근 전개",
    description: "계승 함수의 점근적 행동을 스털링 공식으로 근사",
    status: "pending",
    prover: "한해석",
    language: "Coq",
    likes: 267,
    comments: 38,
    date: "2026-04-20",
    field: "해석학",
    latex: `\\section*{스털링 공식의 점근 전개}

\\textbf{정리 (스털링).}
$$n! \\sim \\sqrt{2\\pi n} \\left(\\frac{n}{e}\\right)^n \\quad (n \\to \\infty)$$

더 정확히는:
$$n! = \\sqrt{2\\pi n} \\left(\\frac{n}{e}\\right)^n \\left(1 + \\frac{1}{12n} + \\frac{1}{288n^2} + O\\!\\left(\\frac{1}{n^3}\\right)\\right)$$

\\begin{proof}
라플라스 방법(Laplace's method)을 적용한다.

감마 함수의 적분 표현으로부터:
$$n! = \\Gamma(n+1) = \\int_0^\\infty t^n e^{-t}\\, dt$$

$t = n + \\sqrt{n}\\, u$로 치환하면:
$$n! = n^n e^{-n} \\sqrt{n} \\int_{-\\sqrt{n}}^\\infty \\exp\\!\\left(-\\frac{u^2}{2} + R(u,n)\\right) du$$

여기서 $R(u,n) = O(u^3 / \\sqrt{n})$이다.

$n \\to \\infty$일 때 적분의 주요 기여는 $u = 0$ 근방에서 오며:
$$\\int_{-\\infty}^{\\infty} e^{-u^2/2}\\, du = \\sqrt{2\\pi}$$

이를 종합하면 $n! \\sim \\sqrt{2\\pi n}\\,(n/e)^n$을 얻는다. \\qed
\\end{proof}`
  }
];

export function getProofById(id: number): Proof | undefined {
  return proofs.find(p => p.id === id);
}
