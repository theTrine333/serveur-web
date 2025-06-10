import React, { useState } from 'react';
import { Search, Calendar, Download, Eye, Printer, Filter } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const ReceiptManagement: React.FC = () => {
  const { state } = useRestaurant();
  const { receipts } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Filter receipts
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const receiptDate = new Date(receipt.timestamp);
    const now = new Date();
    let matchesDate = true;
    
    switch (dateRange) {
      case '7days':
        matchesDate = receiptDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        matchesDate = receiptDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        matchesDate = receiptDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesDate;
  });

  const handlePrintReceipt = (receiptId: string) => {
    const receipt = receipts.find(r => r.id === receiptId);
    if (receipt) {
      // In a real app, this would trigger the browser's print dialog
      console.log('Printing receipt:', receipt);
      window.print();
    }
  };

  const handleDownloadReceipt = (receiptId: string, format: 'pdf' | 'csv' | 'json') => {
    const receipt = receipts.find(r => r.id === receiptId);
    if (receipt) {
      // In a real app, this would generate and download the file
      console.log(`Downloading receipt ${receiptId} as ${format}`);
      
      if (format === 'json') {
        const dataStr = JSON.stringify(receipt, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `receipt-${receipt.receiptNumber}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    }
  };

  // Calculate statistics
  const totalReceipts = filteredReceipts.length;
  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
  const averageAmount = totalReceipts > 0 ? totalAmount / totalReceipts : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Receipt Management</h2>
        
        <button
          onClick={() => handleDownloadReceipt('all', 'csv')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export All</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{totalReceipts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Printer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-600">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Amount</p>
              <p className="text-2xl font-bold text-amber-600">${averageAmount.toFixed(2)}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Eye className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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

      {/* Receipts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt #
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{receipt.receiptNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{receipt.customerName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {new Date(receipt.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        {new Date(receipt.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${receipt.total.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{receipt.paymentMethod}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedReceipt(receipt.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handlePrintReceipt(receipt.id)}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button
                          className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                          title="Download Receipt"
                          onClick={() => handleDownloadReceipt(receipt.id, 'json')}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReceipts.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Printer className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
            <p className="text-gray-500">No receipts match your current search and filters.</p>
          </div>
        )}
      </div>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <ReceiptDetailModal
          receipt={receipts.find(r => r.id === selectedReceipt)!}
          onClose={() => setSelectedReceipt(null)}
          onPrint={() => handlePrintReceipt(selectedReceipt)}
          onDownload={(format) => handleDownloadReceipt(selectedReceipt, format)}
        />
      )}
    </div>
  );
};

// Receipt Detail Modal Component
interface ReceiptDetailModalProps {
  receipt: any;
  onClose: () => void;
  onPrint: () => void;
  onDownload: (format: 'pdf' | 'csv' | 'json') => void;
}

const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  receipt,
  onClose,
  onPrint,
  onDownload
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Receipt Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* Receipt Header */}
          <div className="text-center mb-6 border-b border-gray-200 pb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/icon.png" 
                alt="Serveur" 
                className="w-8 h-8 object-contain"
              />
              <h2 className="text-2xl font-bold text-gray-900">Serveur</h2>
            </div>
            <p className="text-gray-600">123 Main Street, City, State 12345</p>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
          </div>
          
          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Receipt Number</p>
              <p className="font-medium">{receipt.receiptNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">#{receipt.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{receipt.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">
                {new Date(receipt.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
            <div className="space-y-2">
              {receipt.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${receipt.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="text-center mb-6">
            <p className="text-gray-600">Paid via: <span className="font-medium">{receipt.paymentMethod}</span></p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={onPrint}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            
            <button
              onClick={() => onDownload('json')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};