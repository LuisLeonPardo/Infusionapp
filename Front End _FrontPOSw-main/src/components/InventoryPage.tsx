import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Printer, Plus, Package, MoreVertical, ChevronDown } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
}

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    { id: 1, name: 'Cabinet with Doors', category: 'Muebles', stock: 25, price: 18.00, status: 'active' },
    { id: 2, name: 'Manta Manual', category: 'Textiles', stock: 12, price: 15.50, status: 'active' },
    { id: 3, name: 'Escritorio Ejecutivo', category: 'Muebles', stock: 8, price: 250.00, status: 'active' },
    { id: 4, name: 'Lámpara LED', category: 'Iluminación', stock: 0, price: 35.00, status: 'inactive' },
    { id: 5, name: 'Silla Ergonómica', category: 'Muebles', stock: 15, price: 120.00, status: 'active' },
    { id: 6, name: 'Monitor 24"', category: 'Electrónicos', stock: 6, price: 180.00, status: 'active' },
    { id: 7, name: 'Teclado Mecánico', category: 'Electrónicos', stock: 20, price: 85.00, status: 'active' },
    { id: 8, name: 'Alfombra Persa', category: 'Textiles', stock: 3, price: 450.00, status: 'inactive' },
  ];

  const categories = ['all', 'Muebles', 'Textiles', 'Iluminación', 'Electrónicos'];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(inventoryItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  const handleEditProduct = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-main pt-16">
      {/* Sub-header with filters */}
      <div className="bg-bg-surface shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors md:hidden"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </button>
              <h1 className="text-xl font-semibold text-text-primary md:hidden">Inventario</h1>
            </div>
            
            <button 
              onClick={() => navigate('/new-product')}
              className="bg-primary hover:bg-primary-600 text-black font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Crear artículo</span>
            </button>
          </div>

          {/* Filters Row */}
          <div className="pb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-bg-surface border border-divider rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-complement focus:border-transparent text-text-primary"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>

              {/* Status Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'all' 
                      ? 'bg-bg-surface text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'active' 
                      ? 'bg-bg-surface text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Activo
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'inactive' 
                      ? 'bg-bg-surface text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Inactivo
                </button>
              </div>

              {/* All Filters Dropdown */}
              <div className="relative">
                <button className="bg-bg-surface border border-divider rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 text-text-primary">
                  <span>Todos los filtros</span>
                  <ChevronDown size={16} className="text-text-secondary" />
                </button>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-2 ml-auto">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 border border-divider rounded-lg text-sm focus:ring-2 focus:ring-complement focus:border-transparent w-48 bg-bg-surface text-text-primary"
                  />
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Printer size={20} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Desktop/Tablet Table */}
        <div className="hidden md:block bg-bg-surface rounded-lg shadow-sm border border-divider overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-divider">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === inventoryItems.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                  />
                </th>
                <th className="w-16 px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Artículo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider lg:table-cell hidden">
                  Existencia
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider xl:table-cell hidden">
                  Precio
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-bg-surface divide-y divide-divider">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-text-secondary" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">{item.name}</span>
                      <span className={`text-xs ${
                        item.status === 'active' ? 'text-success' : 'text-error'
                      }`}>
                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-text-primary">
                    {item.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-text-primary lg:table-cell hidden">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.stock > 10 
                        ? 'bg-success-100 text-success-800'
                        : item.stock > 0
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {item.stock} unidades
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-text-primary xl:table-cell hidden">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => handleEditProduct(item.id)}
                      className="p-1 hover:bg-gray-50 rounded transition-colors"
                    >
                      <MoreVertical size={16} className="text-text-secondary" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-bg-surface rounded-lg shadow-sm border border-divider p-4"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement mt-1"
                />
                
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={24} className="text-text-secondary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-text-primary truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-text-secondary">{item.category}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.stock > 10 
                            ? 'bg-success-100 text-success-800'
                            : item.stock > 0
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {item.stock} unidades
                        </span>
                        
                        <span className="text-sm font-medium text-text-primary">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <span className={`inline-flex mt-2 text-xs ${
                        item.status === 'active' ? 'text-success' : 'text-error'
                      }`}>
                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleEditProduct(item.id)}
                      className="p-1 hover:bg-gray-50 rounded transition-colors"
                    >
                      <MoreVertical size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-12 text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No se encontraron artículos</h3>
            <p className="text-text-secondary">Intenta ajustar los filtros o crear un nuevo artículo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;