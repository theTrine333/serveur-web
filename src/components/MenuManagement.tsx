import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Star, Clock } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, Category } from '../types';

export const MenuManagement: React.FC = () => {
  const { state, dispatch } = useRestaurant();
  const { menuItems, categories } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (formData: Partial<MenuItem>) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0,
      category: formData.category || categories[0]?.name || '',
      image: formData.image,
      isAvailable: formData.isAvailable ?? true,
      isSpecial: formData.isSpecial ?? false,
      specialPrice: formData.specialPrice,
      preparationTime: formData.preparationTime || 15,
      ingredients: formData.ingredients || [],
      allergens: formData.allergens || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_MENU_ITEM', payload: newItem });
    setShowAddForm(false);
  };

  const handleUpdateItem = (formData: Partial<MenuItem>) => {
    if (editingItem) {
      const updatedItem: MenuItem = {
        ...editingItem,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_MENU_ITEM', payload: updatedItem });
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch({ type: 'DELETE_MENU_ITEM', payload: id });
    }
  };

  const toggleAvailability = (item: MenuItem) => {
    const updatedItem = { ...item, isAvailable: !item.isAvailable, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_MENU_ITEM', payload: updatedItem });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow ${
            !item.isAvailable ? 'opacity-60' : ''
          }`}>
            {item.image && (
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {item.isSpecial && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Special</span>
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {item.isSpecial && item.specialPrice ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-emerald-600">${item.specialPrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{item.preparationTime}m</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">No menu items match your current search and filters.</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingItem) && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onSave={editingItem ? handleUpdateItem : handleAddItem}
          onCancel={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

// Menu Item Form Component
interface MenuItemFormProps {
  item?: MenuItem | null;
  categories: Category[];
  onSave: (data: Partial<MenuItem>) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || categories[0]?.name || '',
    image: item?.image || '',
    isAvailable: item?.isAvailable ?? true,
    isSpecial: item?.isSpecial ?? false,
    specialPrice: item?.specialPrice || 0,
    preparationTime: item?.preparationTime || 15,
    ingredients: item?.ingredients?.join(', ') || '',
    allergens: item?.allergens?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      allergens: formData.allergens.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.specialPrice}
                onChange={(e) => setFormData({ ...formData, specialPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
              <input
                type="number"
                min="1"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma-separated)</label>
              <input
                type="text"
                value={formData.allergens}
                onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Special Offer</span>
            </label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};