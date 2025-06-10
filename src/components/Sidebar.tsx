import React from 'react';
import { 
  Home, 
  Menu, 
  ShoppingCart, 
  Wallet, 
  Receipt, 
  Users, 
  BarChart3, 
  Package, 
  MessageSquare,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'menu', label: 'Menu', icon: Menu },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'receipts', label: 'Receipts', icon: Receipt },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="bg-white shadow-lg border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              src="/icon.png" 
              alt="Serveur" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Serveur</h1>
            <p className="text-sm text-gray-500">Restaurant Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};