import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAllClosures } from '../../hooks/useAllClosures';
import { DailyClosure } from '../../types';
import DashboardLayout from './DashboardLayout';
import ClosuresList from './ClosuresList';
import { NewClosureModal } from './NewClosure/NewClosureModal';
import ClosureDetailPage from './ClosureDetailPage';
import SearchClosures from './SearchClosures';
import CashFlowPage from './CashFlow/CashFlowPage';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';

export default function DashboardPage() {
  const [isNewClosureModalOpen, setIsNewClosureModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { closures, loading } = useAllClosures();
  const navigate = useNavigate();

  const handleClosureClick = (closure: DailyClosure) => {
    navigate(`/dashboard/closure/${closure.id}`);
  };

  const getLatestBalances = () => {
    if (closures.length === 0) {
      return { totalBalance: 0, cashBalance: 0, bankBalance: 0, creditBalance: 0 };
    }

    const latestClosure = closures[0];
    return latestClosure.accounts.reduce(
      (acc, account) => {
        if (account.type === 'efectivo') {
          acc.cashBalance += account.currentBalance;
        } else if (account.type === 'banco') {
          acc.bankBalance += account.currentBalance;
        } else if (account.type === 'credito') {
          acc.creditBalance += account.currentBalance;
        }
        acc.totalBalance += account.currentBalance;
        return acc;
      },
      { totalBalance: 0, cashBalance: 0, bankBalance: 0, creditBalance: 0 }
    );
  };

  const { totalBalance, cashBalance, bankBalance, creditBalance } = getLatestBalances();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <Routes>
      <Route
        path="closure/:id"
        element={
          <ClosureDetailPage
            closures={closures}
            onBack={() => navigate('/dashboard')}
          />
        }
      />
      <Route
        path="cash-flow"
        element={
          <CashFlowPage
            closures={closures}
            onBack={() => navigate('/dashboard')}
          />
        }
      />
      <Route
        path="/"
        element={
          <DashboardLayout>
            <div className="space-y-8">
              <div className="space-y-4">
                <DashboardHeader
                  onNewClosure={() => setIsNewClosureModalOpen(true)}
                  onCashFlow={() => navigate('/dashboard/cash-flow')}
                />

                <SearchClosures 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>

              <DashboardStats
                totalBalance={totalBalance}
                cashBalance={cashBalance}
                bankBalance={bankBalance}
                creditBalance={creditBalance}
              />

              <ClosuresList
                closures={closures}
                searchTerm={searchTerm}
                onClosureClick={handleClosureClick}
              />
            </div>

            <NewClosureModal
              isOpen={isNewClosureModalOpen}
              onClose={() => setIsNewClosureModalOpen(false)}
            />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}