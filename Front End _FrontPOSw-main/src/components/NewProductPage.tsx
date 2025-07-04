import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';

interface VariantValue {
  id: string;
  value: string;
  selected: boolean;
}

interface VariantData {
  [key: string]: {
    isActive: boolean;
    values: VariantValue[];
    newValue: string;
    showPanel: boolean;
  };
}

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productType: 'Producto físico',
    name: '',
    description: '',
    location: '',
    createCategory: false,
    unit: 'Por artículo',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMoreVariantsPanel, setShowMoreVariantsPanel] = useState(false);

  const existingCategories = [
    'Muebles',
    'Textiles', 
    'Iluminación',
    'Electrónicos',
    'Decoración',
    'Oficina'
  ];

  const variantTypes = [
    'Color',
    'Tamaño',
    'Material',
    'Estilo',
    'Acabado'
  ];

  const [variants, setVariants] = useState<VariantData>({
    Color: {
      isActive: false,
      values: [
        { id: '1', value: 'Rojo', selected: false },
        { id: '2', value: 'Azul', selected: false },
        { id: '3', value: 'Verde', selected: false },
        { id: '4', value: 'Negro', selected: false }
      ],
      newValue: '',
      showPanel: false
    },
    Tamaño: {
      isActive: false,
      values: [
        { id: '1', value: 'Pequeño', selected: false },
        { id: '2', value: 'Mediano', selected: false },
        { id: '3', value: 'Grande', selected: false },
        { id: '4', value: 'Extra Grande', selected: false }
      ],
      newValue: '',
      showPanel: false
    },
    Material: {
      isActive: false,
      values: [
        { id: '1', value: 'Madera', selected: false },
        { id: '2', value: 'Metal', selected: false },
        { id: '3', value: 'Plástico', selected: false },
        { id: '4', value: 'Vidrio', selected: false }
      ],
      newValue: '',
      showPanel: false
    },
    Estilo: {
      isActive: false,
      values: [
        { id: '1', value: 'Moderno', selected: false },
        { id: '2', value: 'Clásico', selected: false },
        { id: '3', value: 'Minimalista', selected: false },
        { id: '4', value: 'Industrial', selected: false }
      ],
      newValue: '',
      showPanel: false
    },
    Acabado: {
      isActive: false,
      values: [
        { id: '1', value: 'Mate', selected: false },
        { id: '2', value: 'Brillante', selected: false },
        { id: '3', value: 'Satinado', selected: false },
        { id: '4', value: 'Texturizado', selected: false }
      ],
      newValue: '',
      showPanel: false
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleVariantToggle = (variantType: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        isActive: !prev[variantType].isActive,
        showPanel: !prev[variantType].isActive ? true : false
      }
    }));
  };

  const handleVariantValueToggle = (variantType: string, valueId: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        values: prev[variantType].values.map(value =>
          value.id === valueId ? { ...value, selected: !value.selected } : value
        )
      }
    }));
  };

  const handleAddVariantValue = (variantType: string) => {
    const newValue = variants[variantType].newValue.trim();
    if (newValue) {
      const newId = Date.now().toString();
      setVariants(prev => ({
        ...prev,
        [variantType]: {
          ...prev[variantType],
          values: [...prev[variantType].values, { id: newId, value: newValue, selected: true }],
          newValue: ''
        }
      }));
    }
  };

  const handleNewValueChange = (variantType: string, value: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        newValue: value
      }
    }));
  };

  const handleSaveVariant = (variantType: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        showPanel: false
      }
    }));
  };

  const handleCancelVariant = (variantType: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        showPanel: false,
        isActive: false,
        values: prev[variantType].values.map(value => ({ ...value, selected: false })),
        newValue: ''
      }
    }));
  };

  const getSelectedValues = (variantType: string) => {
    return variants[variantType].values
      .filter(value => value.selected)
      .map(value => value.value)
      .join(', ');
  };

  const handleMoreVariantsToggle = (variantType: string) => {
    setVariants(prev => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        isActive: !prev[variantType].isActive
      }
    }));
  };

  const handleSaveMoreVariants = () => {
    setShowMoreVariantsPanel(false);
  };

  const handleSave = () => {
    // Here you could add validation logic if needed
    // For now, just navigate back to inventory
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen bg-bg-main pt-16">
      {/* Sub-header */}
      <div className="bg-bg-surface shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/inventory')}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors md:hidden"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </button>
              <h1 className="text-xl font-semibold text-text-primary md:hidden">Nuevo Producto</h1>
            </div>
            
            <button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary-600 text-black font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Desktop Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Product Type */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tipo de artículo
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  >
                    <option value="Producto físico">Producto físico</option>
                    <option value="Servicio">Servicio</option>
                    <option value="Digital">Digital</option>
                  </select>
                </div>
                <button className="ml-4 px-4 py-2 text-sm border border-divider rounded-lg hover:bg-gray-50 transition-colors text-text-primary">
                  Cambiar
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nombre (requerido)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent resize-none bg-bg-surface text-text-primary"
                  placeholder="Descripción del producto"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <label className="block text-sm font-medium text-text-primary mb-4">
                Imágenes del producto
              </label>
              <div className="border-2 border-dashed border-divider rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary mb-2">Arrastra y suelta imágenes aquí</p>
                <p className="text-sm text-text-secondary">o haz click para seleccionar archivos</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Ubicaciones
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              >
                <option value="">Seleccionar almacén</option>
                <option value="almacen-principal">Almacén Principal</option>
                <option value="almacen-secundario">Almacén Secundario</option>
                <option value="tienda-fisica">Tienda Física</option>
              </select>
            </div>

            {/* Categorization */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Categorización</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-category"
                    checked={formData.createCategory}
                    onChange={(e) => handleInputChange('createCategory', e.target.checked)}
                    className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                  />
                  <label htmlFor="create-category" className="text-sm font-medium text-text-primary">
                    Crear categoría
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Categorías existentes
                  </label>
                  <div className="space-y-2">
                    {existingCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                        />
                        <label htmlFor={`category-${category}`} className="text-sm text-text-primary">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Units Section */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Unidades</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Unidad
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  >
                    <option value="Por artículo">Por artículo</option>
                    <option value="Por kilogramo">Por kilogramo</option>
                    <option value="Por metro">Por metro</option>
                    <option value="Por litro">Por litro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Precio (requerido)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full pl-8 pr-3 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <button className="w-full p-3 border border-dashed border-divider rounded-lg text-text-secondary hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Agregar unidad adicional</span>
                </button>
              </div>
            </div>

            {/* Inventory Section */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Existencia</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Cantidad de inventario
                  </label>
                  <input
                    type="number"
                    value={formData.inventoryQuantity}
                    onChange={(e) => handleInputChange('inventoryQuantity', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Alerta de existencias bajas
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    placeholder="SKU-001"
                  />
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Variantes</h3>
              
              <div className="space-y-4">
                {variantTypes.map((variant) => (
                  <div key={variant} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`variant-${variant}`}
                        checked={variants[variant].isActive}
                        onChange={() => handleVariantToggle(variant)}
                        className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                      />
                      <label htmlFor={`variant-${variant}`} className="text-sm text-text-primary">
                        {variant}
                      </label>
                    </div>

                    {/* Show selected values summary */}
                    {variants[variant].isActive && !variants[variant].showPanel && getSelectedValues(variant) && (
                      <div className="ml-6 text-sm text-text-secondary">
                        {variant}: {getSelectedValues(variant)}
                      </div>
                    )}

                    {/* Inline Panel */}
                    {variants[variant].showPanel && (
                      <div className="ml-6 border border-divider rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-text-primary">{variant}</h4>
                          <button
                            onClick={() => handleCancelVariant(variant)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <X size={16} className="text-text-secondary" />
                          </button>
                        </div>

                        {/* Add new value */}
                        <div className="flex items-center space-x-2 mb-3">
                          <input
                            type="text"
                            value={variants[variant].newValue}
                            onChange={(e) => handleNewValueChange(variant, e.target.value)}
                            placeholder="Agregar valor"
                            className="flex-1 p-2 border border-divider rounded text-sm focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                          />
                          <button
                            onClick={() => handleAddVariantValue(variant)}
                            className="p-2 bg-complement hover:bg-complement-600 text-white rounded transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Existing values */}
                        <div className="space-y-2 mb-4">
                          {variants[variant].values.map((value) => (
                            <div key={value.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${variant}-${value.id}`}
                                checked={value.selected}
                                onChange={() => handleVariantValueToggle(variant, value.id)}
                                className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                              />
                              <label htmlFor={`${variant}-${value.id}`} className="text-sm text-text-primary">
                                {value.value}
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* Panel actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSaveVariant(variant)}
                            className="px-3 py-1 bg-success hover:bg-success-600 text-white text-sm rounded transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => handleCancelVariant(variant)}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-text-primary text-sm rounded transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowMoreVariantsPanel(true)}
                  className="w-full p-3 border border-dashed border-divider rounded-lg text-text-secondary hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 mt-4"
                >
                  <Plus size={16} />
                  <span>Agregar más variantes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Variants Floating Panel */}
      {showMoreVariantsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-lg shadow-xl max-w-md w-full p-6 border border-divider">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">Agregar Variantes</h3>
              <button
                onClick={() => setShowMoreVariantsPanel(false)}
                className="p-1 hover:bg-gray-50 rounded transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {variantTypes.map((variant) => (
                <div key={variant} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`more-variant-${variant}`}
                    checked={variants[variant].isActive}
                    onChange={() => handleMoreVariantsToggle(variant)}
                    className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                  />
                  <label htmlFor={`more-variant-${variant}`} className="text-sm text-text-primary">
                    {variant}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveMoreVariants}
                className="flex-1 bg-success hover:bg-success-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowMoreVariantsPanel(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-text-primary font-medium py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductPage;