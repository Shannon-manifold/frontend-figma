import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { Header } from "../components/Header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                  ∀
                </div>
                <h3 className="font-bold text-foreground">
                  ShannonManifold
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                고신뢰도 수학 증명을 위한 커뮤니티 플랫폼
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                증명 언어
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Lean 4</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Coq</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Isabelle</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Agda</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                커뮤니티
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">토론</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">기여 가이드</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">행동 강령</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-foreground">
                리소스
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">문서</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">튜토리얼</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm border-border text-muted-foreground">
            © 2026 ShannonManifold. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
