import { useState, useEffect } from 'react';
import { StorySection } from '../components/StorySection';
import { TheoremCard } from '../components/TheoremCard';
import { proofService } from '../services/proofService';
import { ProofResponse } from '../services/types';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const [homeProofs, setHomeProofs] = useState<ProofResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const data = await proofService.getAllProofs();
        // Show first 6 proofs on home page
        setHomeProofs(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch proofs for home page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProofs();
  }, []);

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
          {!loading && (
            <span className="text-sm text-muted-foreground">커뮤니티 검증 {homeProofs.length}건</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : homeProofs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            등록된 정리가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {homeProofs.map((theorem) => (
              <TheoremCard
                key={theorem.id}
                id={theorem.id}
                title={theorem.title}
                description={theorem.description}
                status={theorem.status as 'verified' | 'pending' | 'failed'}
                prover={theorem.prover}
                language={theorem.language}
                likes={theorem.likes}
                comments={theorem.comments}
                date={theorem.date}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

