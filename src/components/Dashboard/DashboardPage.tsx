import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../../lib/firebase';
import { DailyClosure } from '../../types';
import DashboardLayout from './DashboardLayout';
import ClosuresList from './ClosuresList';
import { NewClosureModal } from './NewClosure/NewClosureModal';
import ClosureDetailPage from './ClosureDetailPage';
import { Plus, Wallet, CreditCard, Coins, Search } from 'lucide-react';
import SearchClosures from './SearchClosures';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [closures, setClosures] = useState<DailyClosure[]>([]);
  const [filteredClosures, setFilteredClosures] = useState<DailyClosure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewClosureModalOpen, setIsNewClosureModalOpen] = useState(false);
  const [selectedClosure, setSelectedClosure] = useState<DailyClosure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const closuresRef = ref(db, 'closures');
    const userClosuresQuery = query(
      closuresRef,
      orderByChild('userId'),
      equalTo(currentUser.uid)
    );

    const unsubscribe = onValue(userClosuresQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const closuresList = Object.entries(data).map(([id, closure]) => ({
          ...(closure as DailyClosure),
          id
        }));
        const sortedClosures = closuresList.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setClosures(sortedClosures);
        filterClosures(sortedClosures, searchTerm);
      } else {
        setClosures([]);
        setFilteredClosures([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    filterClosures(closures, searchTerm);
  }, [searchTerm]);

  const filterClosures = (closuresList: DailyClosure[], search: string) => {
    let filtered = [...closuresList];

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(closure => {
        // Search in date
        if (closure.date.includes(searchLower)) return true;

        // Search in observations
        if (closure.observations?.toLowerCase().includes(searchLower)) return true;

        // Search in transactions
        return closure.transactions?.some(transaction => 
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.concept?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredClosures(filtered);
  };

  const handleClosureClick = (closure: DailyClosure) => {
    setSelectedClosure(closure);
  };

  // Calculate total balances from filtered closures
  const { totalBalance, cashBalance, bankBalance } = filteredClosures.reduce(
    (acc, closure) => {
      acc.totalBalance += closure.finalBalance;
      
      closure.accounts.forEach(account => {
        if (account.type === 'efectivo') {
          acc.cashBalance += account.currentBalance;
        } else if (account.type === 'banco') {
          acc.bankBalance += account.currentBalance;
        }
      });
      
      return acc;
    },
    { totalBalance: 0, cashBalance: 0, bankBalance: 0 }
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (selectedClosure) {
    return (
      <ClosureDetailPage
        closure={selectedClosure}
        onBack={() => setSelectedClosure(null)}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Cierres Diarios</h2>
          <button
            className="btn btn-primary inline-flex items-center"
            onClick={() => setIsNewClosureModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Cierre
          </button>
        </div>

        <SearchClosures 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Balance Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Saldo General</h3>
                <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalBalance.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Saldo Efectivo</h3>
                <p className={`text-2xl font-bold ${cashBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${cashBalance.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Saldo Banco</h3>
                <p className={`text-2xl font-bold ${bankBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${bankBalance.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredClosures.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {closures.length === 0
              ? "No hay cierres diarios registrados"
              : "No se encontraron cierres diarios para los criterios seleccionados"}
          </p>
        </div>
      ) : (
        <ClosuresList closures={filteredClosures} onClosureClick={handleClosureClick} />
      )}

      <NewClosureModal
        isOpen={isNewClosureModalOpen}
        onClose={() => setIsNewClosureModalOpen(false)}
      />
    </DashboardLayout>
  );
}