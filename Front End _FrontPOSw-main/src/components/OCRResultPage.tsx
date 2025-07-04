import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check } from 'lucide-react';

interface OCRItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  precision: number;
  match: string;
  selected: boolean;
}

const OCRResultPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data de ítems extraídos por OCR
  const [ocrItems, setOcrItems] = useState<OCRItem[]>([
    {
      id: 1,
      description: 'Cabinet with Doors',
      quantity: 5,
      price: 18.00,
      precision: 95,
      match: 'Cabinet with Doors',
      selected: true
    },
    {
      id: 2,
      description: 'Escritorio Ejecutivo',
      quantity: 2,
      price: 250.00,
      precision: 88,
      match: 'Escritorio Ejecutivo',
      selected: true
    },
    {
      id: 3,
      description: 'Silla Ergonomica',
      quantity: 4,
      price: 120.00,
      precision: 92,
      match: 'Silla Ergonómica',
      selected: true
    },
    {
      id: 4,
      description: 'Lampara LED',
      quantity: 3,
      price: 35.00,
      precision: 78,
      match: 'Nuevo producto',
      selected: false
    },
    {
      id: 5,
      description: 'Monitor 24 pulgadas',
      quantity: 1,
      price: 180.00,
      precision: 85,
      match: 'Monitor 24"',
      selected: true
    }
  ]);

  // Productos existentes para el dropdown de match
  const existingProducts = [
    'Cabinet with Doors',
    'Escritorio Ejecutivo', 
    'Silla Ergonómica',
    'Lámpara LED',
    'Monitor 24"',
    'Teclado Mecánico',
    'Manta Manual',
    'Alfombra Persa',
    'Mesa de Centro',
    'Estantería Modular',
    'Nuevo producto'
  ];

  const handleSelectAll = () => {
    const allSelected = ocrItems.every(item => item.selected);
    setOcrItems(items => 
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const handleItemSelect = (id: number) => {
    setOcrItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleItemChange = (id: number, field: keyof OCRItem, value: string | number) => {
    setOcrItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveChanges = () => {
    // Navigate to Smart Inventory page to show the purchase order manager
    navigate('/smart-inventory');
  };

  const handleExportCSV = () => {
    // Simular exportación CSV
    console.log('Exportando CSV...');
  };

  const selectedCount = ocrItems.filter(item => item.selected).length;
  const allSelected = ocrItems.length > 0 && ocrItems.every(item => item.selected);

  return (
    <div className="min-h-screen bg-bg-main pt-16">
      {/* Header */}
      <div className="bg-bg-surface shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/smart-inventory')}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </button>
              <h1 className="text-xl font-semibold text-text-primary">Resultado OCR</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Document Info */}
        <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Tipo de documento:</span>
              <span className="ml-2 font-medium text-text-primary">Factura de Compra</span>
            </div>
            <div>
              <span className="text-text-secondary">Número:</span>
              <span className="ml-2 font-medium text-text-primary">FC-2024-001234</span>
            </div>
            <div>
              <span className="text-text-secondary">Ítems detectados:</span>
              <span className="ml-2 font-medium text-text-primary">{ocrItems.length}</span>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-50 rounded-lg transition-colors border border-divider"
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
              allSelected ? 'bg-complement border-complement' : 'border-gray-300'
            }`}>
              {allSelected && <Check size={12} className="text-white" />}
            </div>
            <span>Seleccionar todo</span>
          </button>
          
          <div className="text-sm text-text-secondary">
            {selectedCount} de {ocrItems.length} ítems seleccionados
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-bg-surface rounded-lg shadow-sm border border-divider overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-divider">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    ✓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider min-w-[200px]">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-24">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-28">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-24">
                    Precisión (%)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider min-w-[180px]">
                    Match
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg-surface divide-y divide-divider">
                {ocrItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleItemSelect(item.id)}
                        className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">$</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          item.precision >= 90 ? 'text-success' :
                          item.precision >= 80 ? 'text-warning' : 'text-error'
                        }`}>
                          {item.precision}%
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          item.precision >= 90 ? 'bg-success' :
                          item.precision >= 80 ? 'bg-warning' : 'bg-error'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={item.match}
                        onChange={(e) => handleItemChange(item.id, 'match', e.target.value)}
                        className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                      >
                        {existingProducts.map((product) => (
                          <option key={product} value={product}>
                            {product}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 mb-20">
          {ocrItems.map((item) => (
            <div key={item.id} className="bg-bg-surface rounded-lg shadow-sm border border-divider p-4">
              <div className="flex items-start space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleItemSelect(item.id)}
                  className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement mt-1"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Precio
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">$</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full pl-6 pr-2 py-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Precisión
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          item.precision >= 90 ? 'text-success' :
                          item.precision >= 80 ? 'text-warning' : 'text-error'
                        }`}>
                          {item.precision}%
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          item.precision >= 90 ? 'bg-success' :
                          item.precision >= 80 ? 'bg-warning' : 'bg-error'
                        }`}></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Match
                      </label>
                      <select
                        value={item.match}
                        onChange={(e) => handleItemChange(item.id, 'match', e.target.value)}
                        className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                      >
                        {existingProducts.map((product) => (
                          <option key={product} value={product}>
                            {product}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-divider p-4 md:pl-64">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          <button
            onClick={handleExportCSV}
            className="bg-gray-200 hover:bg-gray-300 text-text-primary font-medium py-3 px-6 rounded-lg transition-colors min-w-[120px]"
          >
            <div className="flex items-center justify-center space-x-2">
              <Download size={16} />
              <span>Exportar CSV</span>
            </div>
          </button>
          
          <button
            onClick={handleSaveChanges}
            disabled={selectedCount === 0}
            className={`font-medium py-3 px-6 rounded-lg transition-colors min-w-[140px] ${
              selectedCount > 0
                ? 'bg-primary hover:bg-primary-600 text-black'
                : 'bg-gray-300 text-text-secondary cursor-not-allowed'
            }`}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default OCRResultPage;