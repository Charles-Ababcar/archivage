import React, { useState } from 'react';
import { 
  useGetBankDistributionQuery,
  useGetDashboardStatsQuery, 
  useGetMonthlyFlowQuery, 
  useGetTransactionsQuery 
} from '../../api/transactionApi';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { 
  TrendingUp, TrendingDown, Wallet, Landmark, 
  BarChart3, Clock, PieChart, ArrowRightLeft,
  ChevronRight, X, Search
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart as RechartsPieChart, 
  Pie 
} from 'recharts';

const Dashboard: React.FC = () => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading: loadStats } = useGetDashboardStatsQuery();
  const { data: monthlyData } = useGetMonthlyFlowQuery();
  
  // Petit lot pour le Dashboard
  const { data: transactionsData } = useGetTransactionsQuery({ page: 1, size: 5 });
  // Gros lot pour le Popup (Pagination ignorée ou taille augmentée ici)
  const { data: allTransactionsData } = useGetTransactionsQuery({ page: 1, size: 50 });
  
  const { data: banques } = useGetBanquesQuery();
  const { data: bankDist } = useGetBankDistributionQuery();

  if (loadStats) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 font-sans">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Analyse des flux financiers...</p>
    </div>
  );

  const recentTransactions = transactionsData?.results || [];
  const allTransactions = allTransactionsData?.results || [];
  
  // Filtrage pour la recherche dans le modal
  const filteredAll = allTransactions.filter(t => 
    t.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tiers.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solde Global */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-3xl text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl"><Wallet size={20} /></div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">Global</span>
          </div>
          <p className="text-blue-100 text-xs font-medium">Solde Total Disponible</p>
          <h2 className="text-2xl font-black mt-1">{stats?.solde_global?.toLocaleString()} <small className="text-xs opacity-70 uppercase tracking-tighter">FCFA</small></h2>
        </div>

        {/* Revenus */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Revenus</span>
          </div>
          <p className="text-slate-500 text-xs font-medium italic">Total Entrées (Externes)</p>
          <h2 className="text-2xl font-black text-slate-800 mt-1">{stats?.total_entrees?.toLocaleString()} <small className="text-xs text-slate-400">FCFA</small></h2>
        </div>

        {/* Dépenses */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><TrendingDown size={20} /></div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-wider">Dépenses</span>
          </div>
          <p className="text-slate-500 text-xs font-medium italic">Total Sorties (Externes)</p>
          <h2 className="text-2xl font-black text-slate-800 mt-1">{stats?.total_sorties?.toLocaleString()} <small className="text-xs text-slate-400">FCFA</small></h2>
        </div>

        {/* Banques */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Landmark size={20} /></div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">Banques</span>
          </div>
          <p className="text-slate-500 text-xs font-medium italic">Comptes Connectés</p>
          <h2 className="text-2xl font-black text-slate-800 mt-1">{banques?.length || 0} <small className="text-xs text-slate-400 font-medium">Établissements</small></h2>
        </div>
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BarChart3 size={18}/></div>
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Flux Mensuels</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={24}>
                  {monthlyData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'Entrée' ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <PieChart size={18} className="text-amber-500"/> Répartition
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={bankDist || []} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total" nameKey="banque">
                  {bankDist?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Clock size={18} className="text-purple-500"/> Mouvements Récents
          </h3>
          <button 
            onClick={() => setShowAllModal(true)}
            className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all"
          >
            Voir tout le journal <ChevronRight size={14}/>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${t.type === 'Entrée' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.nature === 'Interne' ? <ArrowRightLeft size={16}/> : (t.type === 'Entrée' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.libelle}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.date_trans} • {t.banque?.nom_banque}</p>
                </div>
              </div>
              <p className={`text-sm font-black ${t.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === 'Entrée' ? '+' : '-'} {t.montant.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- POPUP (MODAL) --- */}
      {showAllModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">Journal Complet</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Historique des 50 dernières opérations</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAllModal(false)}
                className="p-2 hover:bg-rose-100 hover:text-rose-600 text-slate-400 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 px-6 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher par libellé ou tiers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                />
              </div>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {filteredAll.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-3xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${t.type === 'Entrée' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.nature === 'Interne' ? <ArrowRightLeft size={18}/> : (t.type === 'Entrée' ? <TrendingUp size={18}/> : <TrendingDown size={18}/>)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.libelle}</p>
                      <p className="text-[11px] text-slate-500 font-bold uppercase">
                        {t.date_trans} <span className="mx-2 text-slate-200">|</span> {t.banque?.nom_banque} <span className="mx-2 text-slate-200">|</span> {t.nature}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${t.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'Entrée' ? '+' : '-'} {t.montant.toLocaleString()} <span className="text-[10px] font-medium opacity-50">F</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">ID: {t.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
              ))}
              {filteredAll.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold italic">Aucun résultat trouvé pour "{searchTerm}"</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 text-center bg-slate-50/30">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fin du journal affiché</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;