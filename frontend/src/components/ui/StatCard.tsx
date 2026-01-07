import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  trend?: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  colorClass = "bg-blue-500",
  trend,
  description
}) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-5">
      <div className={`p-3 rounded-xl text-white ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800 mb-1">
          {value}
        </p>
        {description && (
          <p className="text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);