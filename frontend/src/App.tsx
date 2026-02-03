import React, { useState } from 'react';
import MainLayout from './components/MainLayout';
import { TabId } from './components/Sidebar';

// Imports des fonctionnalités
import Dashboard from './features/dashboard/Dashboard'; 
import BanqueForm from './features/banques/BanqueForm';
import BanqueList from './features/banques/BanqueList'; 
import TransactionForm from './features/transactions/TransactionForm';
import TransactionTable from './features/transactions/TransactionTable';
import SearchTransactions from './features/transactions/SearchFilters';

// 1. Nouveaux imports à créer
import LevelingForm from './features/transactions/LevelingForm';
import ExtractionPage from './features/transactions/ExtractionPage';

const App: React.FC = () => {
  // Page par défaut sur le Dashboard
  const [activeTab, setActiveTab] = useState<TabId>('DASHBOARD');

  // 2. Mise à jour des titres selon le cahier des charges (Point 3)
  const titles: Record<TabId, string> = {
    DASHBOARD: 'Menu Principal - Tableau de Bord',
    ADD_BANK: 'Paramétrage - Ajouter une Banque',
    ADD_TRANS: 'Saisie - Nouvelle Transaction Externe',
    LEVELING: 'Saisie - Nivellement Bancaire (Interne)',
    BANKS: 'Consultation - Liste des Banques',
    TRANSACTIONS: 'Archivage - Toutes les Transactions',
    SEARCH: 'Module de Recherche par Montant',
    EXTRACTION: 'Reporting - Extraction des Données (Excel)'
  };

  return (
    <MainLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      title={titles[activeTab]}
    >
      {/* Conteneur principal avec style Fintech */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 min-h-[600px]">
        
        {/* Affichage conditionnel des composants */}
        {activeTab === 'DASHBOARD' && <Dashboard />}
        
        {activeTab === 'ADD_BANK' && <BanqueForm />}
        
        {activeTab === 'BANKS' && <BanqueList />} 
        
        {activeTab === 'ADD_TRANS' && <TransactionForm />}

        {/* 3. Nouveau : Formulaire de Nivellement (Règle 4.2 c) */}
        {activeTab === 'LEVELING' && <LevelingForm />}
        
        {activeTab === 'TRANSACTIONS' && <TransactionTable />} 
        
        {activeTab === 'SEARCH' && <SearchTransactions />}

        {/* 4. Nouveau : Page d'extraction Excel (Règle 4.6) */}
        {activeTab === 'EXTRACTION' && <ExtractionPage />}
      </div>
    </MainLayout>
  );
};

export default App;