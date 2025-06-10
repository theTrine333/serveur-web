import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Star } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const Dashboard: React.FC = () => {
  const { state } = useRestaurant();
  const { orders, transactions, walletBalance, feedback } = state;

  // Calculate statistics
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderTime).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
    : 0;

  const stats = [
    {
      title: 'Today\'s Revenue',
      value: `$${todayRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Orders Today',
      value: todayOrders.length.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Wallet Balance',
      value: `$${walletBalance.toFixed(2)}`,
      change: '+5.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'amber'
    },
    {
      title: 'Customer Rating',
      value: averageRating.toFixed(1),
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'purple'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
                <span className={`font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">from yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderTime).toLocaleTimeString()} • Table {order.tableNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">New Order</p>
              <p className="text-sm text-gray-500">Create a new order</p>
            </button>
            <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-left">
              <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="font-medium text-gray-900">Add Payment</p>
              <p className="text-sm text-gray-500">Process payment</p>
            </button>
            <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-left">
              <Users className="w-8 h-8 text-amber-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Staff</p>
              <p className="text-sm text-gray-500">Staff management</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <Star className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">View Feedback</p>
              <p className="text-sm text-gray-500">Customer reviews</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};