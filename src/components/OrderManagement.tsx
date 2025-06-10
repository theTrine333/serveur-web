import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, MapPin, Check, X, AlertCircle, ShoppingCart } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order } from '../types';

export const OrderManagement: React.FC = () => {
  const { state, dispatch } = useRestaurant();
  const { orders } = state;
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Play notification sound for new orders
  useEffect(() => {
    const newOrders = orders.filter(order => order.status === 'new');
    if (newOrders.length > 0) {
      // In a real app, you would play an actual sound file
      console.log('New order notification sound would play here');
      dispatch({ type: 'ADD_NOTIFICATION', payload: `${newOrders.length} new order(s)` });
    }
  }, [orders, dispatch]);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = {
        ...order,
        status: newStatus,
        servedTime: newStatus === 'served' ? new Date().toISOString() : order.servedTime
      };
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-amber-100 text-amber-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="new">New</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['new', 'preparing', 'ready', 'served', 'cancelled'].map(status => {
          const count = orders.filter(order => order.status === status).length;
          return (
            <div key={status} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 capitalize">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Order #{order.id.slice(-4)}</span>
                  {order.status === 'new' && (
                    <AlertCircle className="w-4 h-4 text-blue-500 animate-pulse" />
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                </div>
                
                {order.customerPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customerPhone}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(order.orderTime).toLocaleTimeString()}
                  </span>
                </div>

                {order.tableNumber && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Table {order.tableNumber}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.menuItem.name}</span>
                      <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold text-sm mt-2 pt-2 border-t border-gray-100">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {order.specialRequests && (
                <div className="bg-amber-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-amber-800">
                    <strong>Special Requests:</strong> {order.specialRequests}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                {order.status === 'new' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start Preparing
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Mark Ready
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Served</span>
                  </button>
                )}

                {order.status !== 'served' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">No orders match your current filters.</p>
        </div>
      )}
    </div>
  );
};