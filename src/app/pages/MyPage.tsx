import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { User } from '../services/types';
import { proofService } from '../services/proofService';
import { blogService } from '../services/blogService';
import { questionService } from '../services/questionService';
import { tutorialService } from '../services/tutorialService';
import {
  BookOpen, MessageSquare, Heart, Award,
  Edit3, Check, X, ChevronRight, Bookmark,
  Bell, Shield, Trash2, ExternalLink, LogOut,
  CheckCircle, Clock, HelpCircle, Loader2,
} from 'lucide-react';

/* ─── mock data ─────────────────────────────────────── */
const USER = {
  name: '테스트',
  email: 'test@shannonmanifold.io',
  system: 'Lean 4',
  bio: '수학의 엄밀성을 코드로 증명합니다.',
  joinDate: '2026년 1월',
};

const STATS = [
  { label: '제출한 증명', value: 12, icon: BookOpen },
  { label: 'Q&A 답변', value: 34, icon: MessageSquare },
  { label: '받은 좋아요', value: 128, icon: Heart },
  { label: '기여 포인트', value: '2,450', icon: Award },
];

const MY_PROOFS = [
  { id: 1, title: '페르마의 소정리 (Lean 4)', system: 'Lean 4', status: 'verified', likes: 24, comments: 6, date: '2026.04.12' },
  { id: 2, title: '힐베르트 공간의 완비성', system: 'Lean 4', status: 'verified', likes: 17, comments: 3, date: '2026.03.28' },
  { id: 3, title: '체비쇼프 부등식', system: 'Lean 4', status: 'pending', likes: 5, comments: 1, date: '2026.05.02' },
  { id: 4, title: '리만 적분 가능 조건', system: 'Lean 4', status: 'verified', likes: 31, comments: 9, date: '2026.02.15' },
];

const MY_QNA = [
  { id: 1, type: 'question', title: 'Lean 4에서 nat.rec 없이 귀납법을 쓸 수 있나요?', answers: 3, views: 142, date: '2026.04.20', solved: true },
  { id: 2, type: 'answer', title: 'Coq에서 dependent type을 다루는 방법', answered: '내 답변이 채택됨', date: '2026.04.08', solved: true },
  { id: 3, type: 'question', title: 'Agda의 with 패턴과 case split 차이', answers: 1, views: 67, date: '2026.05.01', solved: false },
  { id: 4, type: 'answer', title: 'setoid rewriting in Lean 4', answered: '답변함', date: '2026.03.15', solved: false },
];

const BOOKMARKS = [
  { id: 1, title: '연속 함수의 극값 정리', author: 'mathproof_kr', system: 'Isabelle', likes: 89, date: '2026.04.05' },
  { id: 2, title: '유한군의 라그랑주 정리', author: 'lean_alice', system: 'Lean 4', likes: 201, date: '2026.03.22' },
  { id: 3, title: 'Cantor-Schroeder-Bernstein', author: 'coq_master', system: 'Coq', likes: 156, date: '2026.02.28' },
];

/* ─── sub-components ─────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) =>
  status === 'verified' ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle className="w-3 h-3" />검증됨
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" />검토 중
    </span>
  );

function ProofsTab({ proofs }: { proofs: any[] }) {
  return (
    <div className="space-y-3">
      {proofs.map((proof, i) => (
        <motion.div
          key={proof.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -1 }}
          className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <StatusBadge status={proof.status} />
                <span className="text-xs text-gray-400">{proof.language}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">{proof.title}</p>
              <p className="text-xs text-gray-400 mt-1">{proof.date}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{proof.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{proof.commentsCount || proof.comments || 0}</span>
              <Link to={`/proofs/${proof.id}`}>
                <motion.button whileHover={{ x: 2 }} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
      {proofs.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-400">
          제출한 증명이 없습니다
        </div>
      )}
    </div>
  );
}

function QnATab({ activities }: { activities: any[] }) {
  return (
    <div className="space-y-3">
      {activities.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -1 }}
          className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                {item.type === 'proof' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    <BookOpen className="w-3 h-3" />증명 기여
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    <MessageSquare className="w-3 h-3" />답변 기여
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {item.date}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      {activities.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-400">
          활동 내역이 없습니다
        </div>
      )}
    </div>
  );
}

function BookmarksTab({
  bookmarks,
  onRemove,
}: {
  bookmarks: any[];
  onRemove: (id: number, targetType: string, targetId: number) => void;
}) {
  const getLinkPath = (type: string, targetId: number) => {
    const t = type.toLowerCase();
    if (t === 'proof') return `/proofs/${targetId}`;
    if (t === 'blog') return `/blog/${targetId}`;
    if (t === 'question') return `/qna/${targetId}`;
    if (t === 'tutorial') return `/tutorials/${targetId}`;
    return '#';
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {bookmarks.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -1 }}
            className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {item.logicSystem || item.targetType}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  by {item.author || '알 수 없음'} · <Heart className="w-3 h-3 inline" /> {item.likes || 0}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link to={getLinkPath(item.targetType, item.targetId)}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(item.id, item.targetType, item.targetId)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {bookmarks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-sm text-gray-400"
        >
          <Bookmark className="w-8 h-8 mx-auto mb-3 text-gray-200" />
          북마크한 항목이 없습니다
        </motion.div>
      )}
    </div>
  );
}

function SettingsTab({
  user,
  onLogout,
  onDeleteAccount
}: {
  user: any;
  onLogout: () => void;
  onDeleteAccount: () => void;
}) {
  const [notifications, setNotifications] = useState({
    email: true,
    answer: true,
    like: false,
    challenge: true,
  });

  useEffect(() => {
    if (user && user.notifications) {
      setNotifications(user.notifications);
    }
  }, [user]);

  const toggle = async (key: keyof typeof notifications) => {
    const nextVal = !notifications[key];
    const updatedNotifs = { ...notifications, [key]: nextVal };
    setNotifications(updatedNotifs);
    try {
      await userService.updateMe({ notifications: updatedNotifs });
    } catch (err) {
      console.error("Failed to update notification settings:", err);
    }
  };

  const NOTIF_ITEMS = [
    { key: 'email' as const, label: '이메일 알림', desc: '서비스 공지 및 주요 알림' },
    { key: 'answer' as const, label: '답변 알림', desc: '내 질문에 새 답변이 달릴 때' },
    { key: 'like' as const, label: '좋아요 알림', desc: '내 증명/답변에 좋아요를 받을 때' },
    { key: 'challenge' as const, label: '난제 알림', desc: '후원 난제 상태 변경 시' },
  ];

  return (
    <div className="space-y-6">
      {/* 알림 설정 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">알림 설정</h3>
        </div>
        <div className="space-y-3">
          {NOTIF_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggle(item.key)}
                className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                style={{ height: '1.375rem' }}
              >
                <motion.div
                  animate={{ x: notifications[item.key] ? 18 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </section>

      {/* 보안 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">보안</h3>
        </div>
        <div className="space-y-2">
          <Link to="/forgot-password">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center justify-between py-2.5 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              비밀번호 변경
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </Link>
        </div>
      </section>

      {/* 계정 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">계정</h3>
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={onLogout}
          className="w-full flex items-center justify-between py-2.5 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer mb-2"
        >
          <span className="flex items-center gap-2"><LogOut className="w-4 h-4" />로그아웃</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.button>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={onDeleteAccount}
          className="w-full flex items-center justify-between py-2.5 px-3 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
        >
          <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" />계정 삭제</span>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </motion.button>
      </section>
    </div>
  );
}

/* ─── main page ──────────────────────────────────────── */
export function MyPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('proofs');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(USER.bio);
  const [draftBio, setDraftBio] = useState(USER.bio);

  const [myProofs, setMyProofs] = useState<any[]>([]);
  const [myActivities, setMyActivities] = useState<any[]>([]);
  const [myBookmarks, setMyBookmarks] = useState<any[]>([]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login?redirect=/mypage');
      return;
    }
    setCheckingAuth(false);

    const fetchUser = async () => {
      try {
        const data = await userService.getMe();
        if (data && typeof data === 'object') {
          setUser(data);
          if (data.bio) {
            setBio(data.bio);
            setDraftBio(data.bio);
          }

          // Fetch user's own proofs
          try {
            const allProofs = await proofService.getAllProofs();
            const userProofs = allProofs.filter((p: any) => p.prover === data.name);
            setMyProofs(userProofs);
          } catch (pe) {
            console.error('Failed to fetch user proofs:', pe);
          }

          // Fetch user's activities
          try {
            const acts = await userService.getMyActivities();
            if (Array.isArray(acts)) {
              setMyActivities(acts);
            }
          } catch (ae) {
            console.error('Failed to fetch user activities:', ae);
          }

          // Fetch user's bookmarks
          try {
            const bms = await userService.getMyBookmarks();
            if (Array.isArray(bms)) {
              setMyBookmarks(bms);
            }
          } catch (be) {
            console.error('Failed to fetch user bookmarks:', be);
          }
        } else {
          setUser(USER);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(USER);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    authService.logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    try {
      await userService.deleteMe();
      authService.logout();
      alert('계정이 성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (err: any) {
      console.error('Failed to delete account:', err);
      alert(err.message || '계정 삭제에 실패했습니다.');
    }
  };

  const saveBio = async () => {
    try {
      await userService.updateMe({ bio: draftBio });
      setBio(draftBio);
      setEditingBio(false);
      const data = await userService.getMe();
      if (data) setUser(data);
    } catch (error) {
      console.error('Failed to save bio:', error);
      alert('소개 저장에 실패했습니다.');
    }
  };

  const cancelBio = () => {
    setDraftBio(bio);
    setEditingBio(false);
  };

  const handleRemoveBookmark = async (bookmarkId: number, targetType: string, targetId: number) => {
    try {
      const type = targetType.toLowerCase();
      if (type === 'proof') {
        await proofService.toggleBookmark(targetId);
      } else if (type === 'blog') {
        await blogService.toggleBookmark(targetId);
      } else if (type === 'question') {
        await questionService.toggleBookmark(targetId);
      } else if (type === 'tutorial') {
        await tutorialService.toggleBookmark(targetId);
      }
      setMyBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      alert('북마크 제거에 실패했습니다.');
    }
  };

  const currentUser = user || USER;

  const stats = [
    { label: '제출한 증명', value: currentUser.statProofs || 0, icon: BookOpen },
    { label: 'Q&A 답변', value: currentUser.statAnswers || 0, icon: MessageSquare },
    { label: '받은 좋아요', value: currentUser.statLikes || 0, icon: Heart },
    { label: '기여 포인트', value: (currentUser.statPoints || 0).toLocaleString(), icon: Award },
  ];

  const tabs = [
    { id: 'proofs', label: '내 증명', count: myProofs.length },
    { id: 'qna', label: '활동 내역', count: myActivities.length },
    { id: 'bookmarks', label: '북마크', count: myBookmarks.length },
    { id: 'settings', label: '설정', count: null },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* 프로필 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-5 mb-8 pb-8 border-b border-gray-200"
      >
        {/* 아바타 */}
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 select-none">
          {(currentUser.name || 'U')[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              {currentUser.preferredSystem || currentUser.system || 'Lean 4'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">{currentUser.email}</p>

          {/* 소개 편집 */}
          <AnimatePresence mode="wait">
            {editingBio ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveBio(); if (e.key === 'Escape') cancelBio(); }}
                  className="flex-1 text-sm text-gray-700 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={saveBio} className="text-green-600 hover:text-green-700 transition-colors">
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={cancelBio} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setDraftBio(bio); setEditingBio(true); }}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
              >
                {bio}
                <Edit3 className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>

          <p className="text-xs text-gray-400 mt-2">{currentUser.joinDate || '2026년 5월'} 가입</p>
        </div>
      </motion.div>

      {/* 통계 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-3 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="p-3 border border-gray-200 rounded-lg text-center bg-white"
          >
            <stat.icon className="w-4 h-4 text-gray-400 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 탭 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex border-b border-gray-200 mb-6 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'proofs' && <ProofsTab proofs={myProofs} />}
            {activeTab === 'qna' && <QnATab activities={myActivities} />}
            {activeTab === 'bookmarks' && <BookmarksTab bookmarks={myBookmarks} onRemove={handleRemoveBookmark} />}
            {activeTab === 'settings' && (
              <SettingsTab
                user={currentUser}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
