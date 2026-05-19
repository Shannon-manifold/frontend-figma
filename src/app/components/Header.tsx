import { Search, User, Menu, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { NotificationPanel } from './NotificationPanel';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => {
    return `transition-colors text-sm ${isActive(path)
      ? 'text-foreground font-medium'
      : 'text-muted-foreground hover:text-foreground'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                ∀
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                ShannonManifold
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5">
              <Link to="/proofs" className={navLinkClass('/proofs')}>정리</Link>
              <Link to="/tutorials" className={navLinkClass('/tutorials')}>튜토리얼</Link>
              <Link
                to="/challenges"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${isActive('/challenges')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                난제
              </Link>
              <Link to="/qna" className={navLinkClass('/qna')}>Q&A</Link>
              <Link to="/contributors" className={navLinkClass('/contributors')}>기여자</Link>
              <Link to="/docs" className={navLinkClass('/docs')}>문서</Link>
              <Link to="/blog" className={navLinkClass('/blog')}>블로그</Link>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center gap-2 rounded px-3 py-1.5 border border-border bg-secondary text-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="정리 검색..."
                className="bg-transparent border-none outline-none text-sm w-40 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <NotificationPanel />
            <ThemeToggle />

            <Link to="/mypage">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Menu className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
