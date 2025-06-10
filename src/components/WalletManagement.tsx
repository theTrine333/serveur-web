import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, CreditCard, Calendar, Filter } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Transaction } from '../types';

export const WalletManagement: React.FC = () => {
  const { state, dispatch } = useRestaurant();
  const { walletBalance, transactions } = state;
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    const transactionDate = new Date(transaction.timestamp);
    const now = new Date();
    let matchesDate = true;
    
    switch (dateRange) {
      case '7days':
        matchesDate = transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        matchesDate = transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        matchesDate = transactionDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        matchesDate = true;
    }
    
    return matchesType && matchesDate;
  });

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'sale' || t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' || t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddFunds = (amount: number, method: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      description: `Funds added via ${method}`,
      timestamp: new Date().toISOString(),
      paymentMethod: method,
      status: 'completed'
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    dispatch({ type: 'SET_WALLET_BALANCE', payload: walletBalance + amount });
    setShowAddFunds(false);
  };

  const handleWithdraw = (amount: number, method: string) => {
    if (amount > walletBalance) {
      alert('Insufficient funds');
      return;
    }
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount,
      description: `Funds withdrawn via ${method}`,
      timestamp: new Date().toISOString(),
      paymentMethod: method,
      status: 'completed'
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    dispatch({ type: 'SET_WALLET_BALANCE', payload: walletBalance - amount });
    setShowWithdraw(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
      case 'deposit':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'withdrawal':
      case 'refund':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale':
      case 'deposit':
        return 'text-emerald-600';
      case 'withdrawal':
      case 'refund':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Funds</span>
          </button>
          
          <button
            onClick={() => setShowWithdraw(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Minus className="w-5 h-5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold">${walletBalance.toFixed(2)}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">${totalWithdrawals.toFixed(2)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="sale">Sales</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="refund">Refunds</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                    <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                    <span>{transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'withdrawal' || transaction.type === 'refund' ? '-' : '+'}
                  ${transaction.amount.toFixed(2)}
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">No transactions match your current filters.</p>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <TransactionModal
          title="Add Funds"
          type="deposit"
          onSubmit={handleAddFunds}
          onCancel={() => setShowAddFunds(false)}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <TransactionModal
          title="Withdraw Funds"
          type="withdrawal"
          maxAmount={walletBalance}
          onSubmit={handleWithdraw}
          onCancel={() => setShowWithdraw(false)}
        />
      )}
    </div>
  );
};

// Transaction Modal Component
interface TransactionModalProps {
  title: string;
  type: 'deposit' | 'withdrawal';
  maxAmount?: number;
  onSubmit: (amount: number, method: string) => void;
  onCancel: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  title,
  type,
  maxAmount,
  onSubmit,
  onCancel
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Credit Card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (maxAmount && numAmount > maxAmount) {
      alert('Amount exceeds available balance');
      return;
    }
    
    onSubmit(numAmount, method);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={maxAmount}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {maxAmount && (
              <p className="text-sm text-gray-500 mt-1">
                Maximum available: ${maxAmount.toFixed(2)}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                type === 'deposit' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {type === 'deposit' ? 'Add Funds' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};