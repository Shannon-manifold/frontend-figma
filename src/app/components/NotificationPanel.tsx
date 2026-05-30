import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle, MessageCircle, Heart, Trophy, X, Check } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';
import { NotificationResponse } from '../services/types';

type Notification = {
  id: number;
  type: 'verified' | 'answer' | 'like' | 'challenge';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

function formatRelativeTime(dateStr: string | Date): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
}

const ICON = {
  verified: { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' },
  answer:   { icon: MessageCircle, bg: 'bg-blue-100', color: 'text-blue-600' },
  like:     { icon: Heart, bg: 'bg-red-100', color: 'text-red-500' },
  challenge:{ icon: Trophy, bg: 'bg-amber-100', color: 'text-amber-600' },
};

export function NotificationPanel() {
  if (!authService.isAuthenticated()) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        if (Array.isArray(data)) {
          const mapped = data.map((n: NotificationResponse) => ({
            id: n.id,
            type: (n.type || '').toLowerCase() as any,
            title: n.title,
            body: n.message,
            time: formatRelativeTime(n.createdAt),
            read: !!n.isRead
          }));
          setNotifications(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [open]);

  const markAll = async () => {
    try {
      await notificationService.readAllNotifications();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const markOne = async (id: number) => {
    try {
      await notificationService.readNotification(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    }
  };

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">알림</span>
                {unread > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {unread}
                  </span>
                )}
              </div>
              <button
                onClick={markAll}
                disabled={unread === 0}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3" />
                모두 읽음
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">알림이 없습니다</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((n) => {
                    const cfg = ICON[n.type];
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => markOne(n.id)}
                        className={`flex gap-3 px-4 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors group ${!n.read ? 'bg-indigo-50/40' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-semibold leading-snug ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>
                              {n.title}
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all flex-shrink-0 mt-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <button className="w-full text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                모든 알림 보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
