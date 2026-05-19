import { StorySection } from '../components/StorySection';
import { TheoremCard } from '../components/TheoremCard';
import { proofs } from '../data/proofs';

export function HomePage() {
  // Show first 6 proofs on home page
  const homeProofs = proofs.slice(0, 6);

  return (
    <>
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            ShannonManifold
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
            ShannonManifold는 증명 보조기로 검증한 수학 정리, 난제, 질문과 답변을
            한곳에 모아 신뢰할 수 있는 수학 지식을 함께 쌓는 커뮤니티입니다.
          </p>
        </div>
      </section>

      <StorySection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">최근 정리</h2>
          <span className="text-sm text-muted-foreground">커뮤니티 검증 {homeProofs.length}건</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {homeProofs.map((theorem) => (
            <TheoremCard key={theorem.id} {...theorem} />
          ))}
        </div>
      </main>
    </>
  );
}
