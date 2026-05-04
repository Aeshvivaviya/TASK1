import React from 'react';

/**
 * Stats card for admin dashboard
 */
const StatsCard = ({ icon: Icon, label, value, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'from-primary-500/20 to-accent-500/20 border-primary-500/30 text-primary-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`card p-5 bg-gradient-to-br ${colorMap[color]} border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value ?? '—'}</p>
          {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 bg-slate-800/50 rounded-xl">
            <Icon size={20} className={colorMap[color].split(' ').pop()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
