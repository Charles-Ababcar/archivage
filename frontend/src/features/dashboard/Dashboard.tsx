import React from 'react';
import { 
  useGetBankDistributionQuery,
  useGetDashboardStatsQuery, 
  useGetMonthlyFlowQuery, 
  useGetTransactionsQuery 
} from '../../api/transactionApi';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { TrendingUp, TrendingDown, Wallet, Landmark, BarChart3, Clock, PieChart } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: loadStats } = useGetDashboardStatsQuery();
  const { data: monthlyData } = useGetMonthlyFlowQuery();
  const { data: recentTransactions } = useGetTransactionsQuery({});
  const { data: banques } = useGetBanquesQuery();
  const { data: bankDist } = useGetBankDistributionQuery();

  if (loadStats) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-xs text-slate-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Données pour le graphique circulaire
  const pieChartData = bankDist?.map(item => ({
    name: item.banque,
    value: item.total,
    count: item.count
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Fonction de formattage pour le tooltip
  const formatTooltipValue = (value: unknown) => {
    const numValue = typeof value === 'number' ? value : 0;
    return `${Number(numValue).toLocaleString()} FCFA`;
  };

  return (
    <div className="space-y-4">
      {/* 1. KPIs très compacts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
              <Wallet size={14} />
            </div>
            <p className="text-xs font-medium text-slate-600">Solde</p>
          </div>
          <p className="text-base font-bold text-slate-800">
            {stats?.solde_global?.toLocaleString() || 0} FCFA
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
              <TrendingUp size={14} />
            </div>
            <p className="text-xs font-medium text-slate-600">Entrées</p>
          </div>
          <p className="text-base font-bold text-slate-800">
            {stats?.total_entrees?.toLocaleString() || 0} FCFA
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-rose-100 text-rose-600">
              <TrendingDown size={14} />
            </div>
            <p className="text-xs font-medium text-slate-600">Sorties</p>
          </div>
          <p className="text-base font-bold text-slate-800">
            {stats?.total_sorties?.toLocaleString() || 0} FCFA
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-amber-100 text-amber-600">
              <Landmark size={14} />
            </div>
            <p className="text-xs font-medium text-slate-600">Banques</p>
          </div>
          <p className="text-base font-bold text-slate-800">
            {banques?.length || 0}
          </p>
        </div>
      </div>

      {/* 2. Graphiques compacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique mensuel */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-800">Flux mensuel</h3>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData || []}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(val) => `M${val}`} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: unknown) => [formatTooltipValue(value), 'Montant']}
                  contentStyle={{ 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    padding: '6px'
                  }}
                />
                <Bar dataKey="total" radius={[3, 3, 0, 0]} barSize={20}>
                  {monthlyData?.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'Entrée' ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique circulaire */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-800">Répartition</h3>
          </div>
          <div className="h-[180px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={1}
                    dataKey="value"
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: unknown) => formatTooltipValue(value)}
                    contentStyle={{ 
                      borderRadius: '6px', 
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      padding: '6px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-xs">Aucune donnée</p>
              </div>
            )}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-purple-500" />
            <h3 className="text-sm font-semibold text-slate-800">Activités récentes</h3>
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
            {recentTransactions?.slice(0, 4).map((t) => (
              <div 
                key={t.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${t.type === 'Entrée' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    {t.type === 'Entrée' ? (
                      <TrendingUp size={12} className="text-emerald-600" />
                    ) : (
                      <TrendingDown size={12} className="text-rose-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs text-slate-800 truncate">{t.libelle}</p>
                    <p className="text-xs text-slate-500">{t.date_trans}</p>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className={`font-semibold text-xs ${t.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'Entrée' ? '+' : '-'}{t.montant.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}
            {(!recentTransactions || recentTransactions.length === 0) && (
              <div className="text-center py-4">
                <p className="text-slate-400 text-xs">Aucune transaction</p>
              </div>
            )}
          </div>
        </div>

        {/* Banques */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Landmark size={16} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-800">Solde par banque</h3>
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
            {bankDist?.slice(0, 4).map((item, index) => {
              const totalEntrees = stats?.total_entrees || 1;
              const percentage = Math.min((item.total / totalEntrees) * 100, 100);
              
              return (
                <div key={index} className="p-2 rounded-md border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-xs text-slate-800 truncate flex-1">{item.banque}</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-2">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1.5">
                    {item.total.toLocaleString()} FCFA
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
            {(!bankDist || bankDist.length === 0) && (
              <div className="text-center py-4">
                <p className="text-slate-400 text-xs">Aucune donnée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;