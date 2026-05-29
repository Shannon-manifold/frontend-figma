import { CheckCircle, Clock, XCircle, MessageSquare, Heart, Code } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface TheoremCardProps {
  id: number | string;
  title: string;
  description: string;
  status: 'verified' | 'pending' | 'failed';
  prover: string;
  language: string;
  likes: number;
  comments: number;
  date: string;
}

export function TheoremCard({
  id,
  title,
  description,
  status,
  prover,
  language,
  likes,
  comments,
  date
}: TheoremCardProps) {
  const statusConfig = {
    verified: {
      icon: CheckCircle,
      color: 'text-green-700 dark:text-green-400',
      bg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
      label: '검증됨'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-700 dark:text-yellow-400',
      bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900',
      label: '검증 중'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
      label: '검증 실패'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Link to={`/proofs/${id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, boxShadow: '0 12px 32px var(--shadow-color, rgba(0,0,0,0.12))' }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1.5 leading-snug">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium flex-shrink-0 ${config.bg} ${config.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground/60 mb-4">
          <div className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5" />
            <span>{language}</span>
          </div>
          <span>·</span>
          <span>{prover}</span>
          <span>·</span>
          <span>{date}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>{comments}</span>
            </span>
          </div>

          <span className="text-xs text-primary font-medium">
            증명 보기 →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

