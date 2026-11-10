import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  LogOut,
  Search,
  RefreshCw,
  Heart,
  Ghost,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Calendar,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { VisitorData } from '../../types';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface AdminDashboardProps {
  token: string;
  adminUsername: string;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUsername,
  onLogout,
  onBackToSite,
}) => {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'yes' | 'no'>('all');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVisitors = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/visitors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.visitors) && data.visitors.length > 0) {
        setVisitors(data.visitors);
        setIsLoading(false);
        return;
      }

      // Direct client fallback to ensure zero data loss
      const snap = await getDocs(collection(db, 'visitors'));
      const fallbackList: VisitorData[] = [];
      snap.forEach((d) => {
        const item = d.data();
        fallbackList.push({
          ...(item as VisitorData),
          visitorId: item.visitorId || d.id,
          visitorName: item.visitorName || 'Unknown',
        });
      });

      if (fallbackList.length > 0) {
        fallbackList.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setVisitors(fallbackList);
      } else {
        setVisitors(data.visitors || []);
      }
    } catch {
      setError('Connection failed. Could not fetch visitor responses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [token]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Kya aap sach me yeh visitor response delete karna chahte hain?')) {
      return;
    }
    setDeletingId(id);
    try {
      await fetch(`/api/admin/visitor/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore static host backend miss
    }

    try {
      await deleteDoc(doc(db, 'visitors', id));
    } catch (err) {
      console.warn('Direct delete error:', err);
    }

    setVisitors((prev) => prev.filter((v) => v.visitorId !== id));
    if (selectedVisitor?.visitorId === id) {
      setSelectedVisitor(null);
    }
    setDeletingId(null);
  };

  // Filter visitors
  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch = (v.visitorName || '').toLowerCase().includes(searchQuery.toLowerCase())
      || (v.snapchatId || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'completed') return v.completionStatus === 'completed';
    if (statusFilter === 'in_progress') return v.completionStatus === 'in_progress';
    if (statusFilter === 'yes') return v.finalAnswer === 'YES';
    if (statusFilter === 'no') return v.finalAnswer === 'NO';
    return true;
  });

  // Calculate Metrics
  const totalVisitors = visitors.length;
  const completedCount = visitors.filter((v) => v.completionStatus === 'completed').length;
  const yesCount = visitors.filter((v) => v.finalAnswer === 'YES').length;
  const noCount = visitors.filter((v) => v.finalAnswer === 'NO').length;

  const formatDate = (isoOrTimestamp?: string) => {
    if (!isoOrTimestamp) return 'N/A';
    try {
      const date = new Date(isoOrTimestamp);
      return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(isoOrTimestamp);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-white">
      {/* Top Navigation Bar with Back and Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-pink-500/30 text-pink-200 hover:text-white transition-all cursor-pointer text-sm font-medium"
            title="Return to the romantic website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wapas Website</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-rose-200">
              Dil Se Admin Dashboard
            </h1>
            <p className="text-pink-300/60 text-xs">
              Logged in as <span className="font-semibold text-rose-300">{adminUsername}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchVisitors}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-pink-500/30 text-pink-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh responses"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 hover:text-white transition-all cursor-pointer text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 my-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-pink-500/20 backdrop-blur-md">
          <p className="text-xs text-pink-300/70 uppercase tracking-wider font-medium">Total Visitors</p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">{totalVisitors}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-600/20 to-pink-600/10 border border-rose-500/30 backdrop-blur-md">
          <p className="text-xs text-rose-300/80 uppercase tracking-wider font-medium flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>YES Responses</span>
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-rose-200 mt-1">{yesCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-md">
          <p className="text-xs text-slate-300/80 uppercase tracking-wider font-medium">NO Responses</p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-slate-200 mt-1">{noCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-pink-500/20 backdrop-blur-md">
          <p className="text-xs text-pink-300/70 uppercase tracking-wider font-medium">Completed</p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-pink-100 mt-1">
            {completedCount} <span className="text-xs font-sans text-pink-300/60 font-normal">/ {totalVisitors}</span>
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or Snapchat ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/20 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 text-white placeholder-pink-300/40 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'yes', label: 'YES ❤️' },
              { key: 'no', label: 'NO' },
              { key: 'completed', label: 'Completed' },
              { key: 'in_progress', label: 'In Progress' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === filter.key
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-pink-200/70 border border-pink-500/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visitor List */}
      {isLoading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-400 mb-3" />
          <p className="text-pink-300/70 text-sm">Loading visitor responses...</p>
        </div>
      ) : filteredVisitors.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-pink-500/20 rounded-3xl p-8">
          <MessageCircle className="w-12 h-12 text-pink-400/40 mx-auto mb-3" />
          <p className="text-lg font-serif text-pink-100">Abhi koi responses nahi mile</p>
          <p className="text-sm text-pink-300/60 mt-1">
            Jaise hi koi visitor website par jawab dega, unka response yahan dikhega!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisitors.map((visitor) => (
            <motion.div
              key={visitor.visitorId}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedVisitor(visitor)}
              className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-pink-500/20 hover:border-pink-400/40 backdrop-blur-md cursor-pointer transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header with Name & Final Answer badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-pink-200 transition-colors">
                      {visitor.visitorName || 'Anonymous Visitor'}
                    </h3>
                    <p className="text-[11px] text-pink-300/60 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(visitor.updatedAt || visitor.createdAt)}
                    </p>
                  </div>

                  {visitor.finalAnswer === 'YES' ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Heart className="w-3 h-3 fill-current text-rose-400" />
                      YES ❤️
                    </span>
                  ) : visitor.finalAnswer === 'NO' ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-slate-200 text-xs font-medium">
                      NO
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-medium">
                      Scene {visitor.currentScene || 1}
                    </span>
                  )}
                </div>

                {/* Snippets */}
                <div className="space-y-2 text-xs text-pink-100/80 mb-4">
                  {visitor.snapchatId && (
                    <p className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1.5 rounded-lg border border-pink-500/10">
                      <Ghost className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                      <span className="text-pink-300/60">Snap:</span>
                      <span className="font-mono text-yellow-100 font-medium truncate">{visitor.snapchatId}</span>
                    </p>
                  )}

                  {visitor.personalMessage && (
                    <p className="italic bg-rose-950/30 p-2 rounded-lg border border-rose-500/10 line-clamp-2">
                      &ldquo;{visitor.personalMessage}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-pink-500/10 text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    visitor.completionStatus === 'completed'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {visitor.completionStatus === 'completed' ? 'Completed' : 'In Progress'}
                </span>

                <button
                  onClick={(e) => handleDelete(visitor.visitorId, e)}
                  disabled={deletingId === visitor.visitorId}
                  className="p-1.5 rounded-lg hover:bg-rose-900/50 text-pink-400/60 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Visitor Detail Modal */}
      <AnimatePresence>
        {selectedVisitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 sm:p-8 text-white border border-pink-500/30 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedVisitor(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                  {selectedVisitor.visitorName?.[0]?.toUpperCase() || 'V'}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-pink-100">
                    {selectedVisitor.visitorName}
                  </h2>
                  <p className="text-xs text-pink-300/60">
                    ID: {selectedVisitor.visitorId} • {formatDate(selectedVisitor.updatedAt || selectedVisitor.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-2xl bg-white/5 border border-pink-500/20 text-sm">
                <div>
                  <span className="text-xs text-pink-300/60 block">Proposal Answer:</span>
                  <span className="font-bold text-base text-rose-300">
                    {selectedVisitor.finalAnswer || 'Awaiting Proposal'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-pink-300/60 block">Session Status:</span>
                  <span className="font-semibold text-base text-emerald-400 capitalize">
                    {selectedVisitor.completionStatus}
                  </span>
                </div>
              </div>

              {/* Detailed Responses Breakdown */}
              <div className="space-y-4">
                {/* Snapchat Response */}
                <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300/80 mb-1 flex items-center gap-1.5">
                    <Ghost className="w-4 h-4 text-yellow-300" />
                    <span>Scene 4 — Snapchat Question</span>
                  </h4>
                  <p className="text-sm text-pink-100 font-medium">
                    Answer: {selectedVisitor.snapchatAnswer || 'Not answered yet'}
                  </p>
                  {selectedVisitor.snapchatId && (
                    <p className="text-xs text-amber-200 font-mono mt-1 bg-black/40 px-3 py-1.5 rounded-lg inline-block">
                      Snapchat ID: {selectedVisitor.snapchatId}
                    </p>
                  )}
                </div>

                {/* Memory Response */}
                <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300/80 mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>Scene 6 — Memory Question</span>
                  </h4>
                  <p className="text-sm text-pink-100 font-medium">
                    Choice: {selectedVisitor.memoryAnswer || 'Not answered yet'}
                  </p>
                  {selectedVisitor.memoryFollowUp && (
                    <div className="mt-2 text-xs sm:text-sm text-pink-200/90 bg-rose-950/40 p-3 rounded-xl border border-rose-500/20">
                      <span className="text-pink-300/60 block text-[11px] mb-0.5">Follow-up story:</span>
                      {selectedVisitor.memoryFollowUp}
                    </div>
                  )}
                </div>

                {/* Personal Message */}
                <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-300/80 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-rose-400" />
                    <span>Scene 7 — Personal Message</span>
                  </h4>
                  {selectedVisitor.personalMessage ? (
                    <p className="text-sm sm:text-base italic text-pink-100 bg-black/30 p-3.5 rounded-xl border border-pink-500/10 leading-relaxed">
                      &ldquo;{selectedVisitor.personalMessage}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-pink-300/50 italic">No personal message submitted.</p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-pink-500/20 text-right">
                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all cursor-pointer"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
