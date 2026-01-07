import React, { useState } from 'react';
import MainLayout from './components/MainLayout';
import { TabId } from './components/Sidebar';

// 1. Import du Dashboard
import Dashboard from './features/dashboard/Dashboard'; 
import BanqueForm from './features/banques/BanqueForm';
import BanqueList from './features/banques/BanqueList'; 
import TransactionForm from './features/transactions/TransactionForm';
import TransactionTable from './features/transactions/TransactionTable';
import SearchTransactions from './features/transactions/SearchFilters';

const App: React.FC = () => {
  // Optionnel : Tu peux changer 'ADD_BANK' par 'DASHBOARD' pour qu'il soit la page d'accueil
  const [activeTab, setActiveTab] = useState<TabId>('DASHBOARD');

  // 2. Mise à jour des titres (Assure-toi que DASHBOARD est dans ton type TabId)
  const titles: Record<TabId, string> = {
    DASHBOARD: 'Tableau de Bord Financier',
    ADD_BANK: 'Créer une nouvelle Banque',
    ADD_TRANS: 'Archiver une Transaction',
    BANKS: 'Liste des Banques',
    TRANSACTIONS: 'Historique des Opérations',
    SEARCH: 'Recherche Avancée'
  };

  return (
    <MainLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      title={titles[activeTab]}
    >
      {/* Switch de contenu */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        
        {/* 3. Ajout de la condition pour le Dashboard */}
        {activeTab === 'DASHBOARD' && <Dashboard />}
        
        {activeTab === 'ADD_BANK' && <BanqueForm />}
        
        {activeTab === 'BANKS' && <BanqueList />} 
        
        {activeTab === 'ADD_TRANS' && <TransactionForm />}
        
        {activeTab === 'TRANSACTIONS' && <TransactionTable />} 
        
        {activeTab === 'SEARCH' && <SearchTransactions />}
      </div>
    </MainLayout>
  );
};

export default App;