import React, { useState } from 'react';
import { RestaurantProvider } from './context/RestaurantContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OrderManagement } from './components/OrderManagement';
import { MenuManagement } from './components/MenuManagement';
import { WalletManagement } from './components/WalletManagement';
import { ReceiptManagement } from './components/ReceiptManagement';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'wallet':
        return <WalletManagement />;
      case 'receipts':
        return <ReceiptManagement />;
      case 'inventory':
        return <div className="p-6"><h2 className="text-2xl font-bold">Inventory Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case 'staff':
        return <div className="p-6"><h2 className="text-2xl font-bold">Staff Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case 'analytics':
        return <div className="p-6"><h2 className="text-2xl font-bold">Analytics Dashboard</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case 'feedback':
        return <div className="p-6"><h2 className="text-2xl font-bold">Customer Feedback</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <RestaurantProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </RestaurantProvider>
  );
}

export default App;