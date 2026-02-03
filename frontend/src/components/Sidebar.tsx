import React from 'react';
import { 
  PlusCircle, 
  Landmark, 
  History, 
  Search, 
  LayoutDashboard,
  Building,
  BarChart3,
  LucideIcon, // Import du type pour TypeScript
  ArrowLeftRight,
  FileSpreadsheet
} from 'lucide-react';

// Définition rigoureuse des types d'onglets
export type TabId = 'DASHBOARD' | 'ADD_BANK' | 'ADD_TRANS' | 'LEVELING' | 'BANKS' | 'TRANSACTIONS' | 'SEARCH' | 'EXTRACTION';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

interface MenuItem {
  id: TabId;
  label: string;
  icon: LucideIcon; // On utilise le type spécifique de Lucide
  description: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  
  const menuItems: MenuItem[] = [
    { 
      id: 'DASHBOARD', 
      label: 'Tableau de Bord', 
      icon: BarChart3,
      description: 'Vue d\'ensemble'
    },
    { 
      id: 'ADD_BANK', 
      label: 'Ajouter Banque', 
      icon: Building, 
      description: 'Nouvelle institution'
    },
    { 
      id: 'ADD_TRANS', 
      label: 'Nouvelle Transaction', 
      icon: PlusCircle, 
      description: 'Archiver opération'
    },
    { 
      id: 'BANKS', 
      label: 'Banques', 
      icon: Landmark, 
      description: 'Voir toutes'
    },
    { 
      id: 'TRANSACTIONS', 
      label: 'Transactions', 
      icon: History, 
      description: 'Historique complet'
    },{ 
  id: 'LEVELING', 
  label: 'Nivellement', 
  icon: ArrowLeftRight, // Importe ArrowLeftRight de lucide-react
  description: 'Transfert entre banques'
},
{ 
  id: 'EXTRACTION', 
  label: 'Extraction', 
  icon: FileSpreadsheet, // Importe FileSpreadsheet de lucide-react
  description: 'Rapports Excel'
},
    { 
      id: 'SEARCH', 
      label: 'Recherche', 
      icon: Search, 
      description: 'Explorer archives'
    },
  ];

  return (
    <aside className="w-80 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Header élégant */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
              FIN-ARCHIVE
            </h1>
            <p className="text-xs text-slate-400 mt-1">Gestion financière intelligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          // On extrait le composant d'icône pour l'utiliser comme une balise JSX
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                : 'hover:bg-slate-800/50 hover:border hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-500' : 'bg-slate-800 group-hover:bg-slate-700'
              }`}>
                <IconComponent 
                  size={18} 
                  className={activeTab === item.id ? 'text-white' : 'text-slate-400'} 
                />
              </div>
              
              <div className="text-left flex-1">
                <span className={`font-semibold block ${
                  activeTab === item.id ? 'text-white' : 'text-slate-300'
                }`}>
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block italic">
                  {item.description}
                </span>
              </div>

              {activeTab === item.id && (
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-blue-300 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/50">
        <div className="text-center text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
          <p>Powered by FastAPI & React</p>
          <p className="mt-1 opacity-50">© 2024 FIN-ARCHIVE</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;