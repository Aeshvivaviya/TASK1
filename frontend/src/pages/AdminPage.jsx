import React, { useState, useEffect, useCallback } from 'react';
import {
  FiUsers, FiMail, FiCheckCircle, FiRefreshCw,
  FiSearch, FiFilter, FiAlertCircle,
} from 'react-icons/fi';
import { fetchCandidates, fetchStats } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'task_assigned', label: 'Task Assigned' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const AdminPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch stats
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await fetchStats();
      setStats(data.data);
    } catch {
      // Stats failure is non-critical
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch candidates
  const loadCandidates = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      setError('');

      try {
        const data = await fetchCandidates({
          page,
          limit: 10,
          status: statusFilter || undefined,
          search: search || undefined,
        });
        setCandidates(data.data.candidates);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err.userMessage || 'Failed to load candidates');
        toast.error('Failed to load candidates');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, statusFilter, search]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timer = setTimeout(() => loadCandidates(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [loadCandidates, search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const handleStatusUpdate = (id, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
    loadStats(); // Refresh stats
  };

  const handleRefresh = () => {
    loadCandidates(true);
    loadStats();
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage candidates and track applications</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-700 transition-colors text-sm disabled:opacity-50"
          >
            <FiRefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-2/3 mb-3" />
                <div className="h-8 bg-slate-800 rounded w-1/2" />
              </div>
            ))
          ) : (
            <>
              <StatsCard
                icon={FiUsers}
                label="Total Applicants"
                value={stats?.total ?? 0}
                color="primary"
              />
              <StatsCard
                icon={FiMail}
                label="Emails Sent"
                value={stats?.emailsSent ?? 0}
                color="blue"
              />
              <StatsCard
                icon={FiCheckCircle}
                label="Accepted"
                value={stats?.byStatus?.accepted ?? 0}
                color="green"
              />
              <StatsCard
                icon={FiFilter}
                label="Under Review"
                value={stats?.byStatus?.under_review ?? 0}
                color="yellow"
              />
            </>
          )}
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f.value
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading candidates..." />
          </div>
        ) : error ? (
          <div className="card p-10 text-center">
            <FiAlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">{error}</p>
            <button
              onClick={() => loadCandidates()}
              className="mt-4 text-primary-400 hover:text-primary-300 text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : candidates.length === 0 ? (
          <div className="card p-16 text-center">
            <FiUsers size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 font-medium text-lg">No candidates found</p>
            <p className="text-slate-500 text-sm mt-1">
              {search || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Applications will appear here once submitted'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-slate-400 text-sm">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} candidates
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30 text-sm font-medium">
                    {page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
