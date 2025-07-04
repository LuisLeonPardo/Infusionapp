import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, CreditCard, Upload, Archive, RotateCcw, FileText, Star, Plus, MoreVertical, X, Edit, Save, Calendar, User, Package } from 'lucide-react';

interface OrderItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

interface PurchaseOrder {
  id: number;
  date: string;
  supplier: string;
  total: number;
  status: 'Pendiente' | 'Verificado' | 'Recibido';
  items: OrderItem[];
}

const SmartInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMode, setActiveMode] = useState<'scan' | 'purchase'>('scan');
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<PurchaseOrder | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for purchase orders
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      date: '2024-01-15',
      supplier: 'Proveedor ABC',
      total: 1250.00,
      status: 'Pendiente',
      items: [
        { id: 1, description: 'Cabinet with Doors', quantity: 5, price: 180.00 },
        { id: 2, description: 'Escritorio Ejecutivo', quantity: 2, price: 250.00 },
        { id: 3, description: 'Silla Ergonómica', quantity: 3, price: 120.00 }
      ]
    },
    {
      id: 2,
      date: '2024-01-14',
      supplier: 'Distribuidora XYZ',
      total: 890.50,
      status: 'Verificado',
      items: [
        { id: 1, description: 'Monitor 24 pulgadas', quantity: 3, price: 180.00 },
        { id: 2, description: 'Teclado Mecánico', quantity: 4, price: 85.00 },
        { id: 3, description: 'Mouse Inalámbrico', quantity: 5, price: 45.00 }
      ]
    },
    {
      id: 3,
      date: '2024-01-12',
      supplier: 'Muebles del Norte',
      total: 2100.75,
      status: 'Recibido',
      items: [
        { id: 1, description: 'Mesa de Conferencias', quantity: 1, price: 1200.00 },
        { id: 2, description: 'Sillas de Oficina', quantity: 8, price: 95.00 },
        { id: 3, description: 'Archivador Metálico', quantity: 2, price: 180.00 }
      ]
    },
    {
      id: 4,
      date: '2024-01-10',
      supplier: 'Tech Solutions',
      total: 750.00,
      status: 'Pendiente',
      items: [
        { id: 1, description: 'Laptop Dell', quantity: 1, price: 650.00 },
        { id: 2, description: 'Mouse Pad', quantity: 5, price: 20.00 }
      ]
    },
    {
      id: 5,
      date: '2024-01-08',
      supplier: 'Oficina Total',
      total: 1580.25,
      status: 'Recibido',
      items: [
        { id: 1, description: 'Impresora Multifuncional', quantity: 1, price: 450.00 },
        { id: 2, description: 'Papel A4', quantity: 20, price: 15.00 },
        { id: 3, description: 'Cartuchos de Tinta', quantity: 8, price: 35.00 }
      ]
    }
  ]);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    supplier: '',
    date: '',
    items: [{ id: 1, description: '', quantity: 1, price: 0 }]
  });

  // File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo PDF o imagen (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
      return;
    }

    // Simulate file processing
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      // Navigate to OCR results page
      navigate('/ocr-result');
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenOrderModal = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setEditedOrder({ ...order, items: [...order.items] });
    setShowOrderModal(true);
    setIsEditing(false);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setEditedOrder(null);
    setIsEditing(false);
  };

  const handleEditOrder = () => {
    setIsEditing(true);
  };

  const handleSaveOrder = () => {
    if (editedOrder) {
      // Update the order in the orders array
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === editedOrder.id ? editedOrder : order
        )
      );
      setSelectedOrder(editedOrder);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedOrder) {
      setEditedOrder({ ...selectedOrder, items: [...selectedOrder.items] });
    }
    setIsEditing(false);
  };

  const handleOrderFieldChange = (field: keyof PurchaseOrder, value: any) => {
    if (editedOrder) {
      setEditedOrder(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleItemChange = (itemId: number, field: keyof OrderItem, value: any) => {
    if (editedOrder) {
      setEditedOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      });
    }
  };

  const calculateTotal = () => {
    if (!editedOrder) return 0;
    return editedOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // Update total when items change
  React.useEffect(() => {
    if (editedOrder && isEditing) {
      const newTotal = calculateTotal();
      setEditedOrder(prev => prev ? { ...prev, total: newTotal } : null);
    }
  }, [editedOrder?.items, isEditing]);

  const handleDeleteOrder = (orderId: number) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    handleCloseOrderModal();
  };

  const handleNewOrderSubmit = () => {
    const total = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const order: PurchaseOrder = {
      id: orders.length + 1,
      date: newOrder.date,
      supplier: newOrder.supplier,
      total,
      status: 'Pendiente',
      items: newOrder.items
    };
    
    setOrders([order, ...orders]);
    setNewOrder({
      supplier: '',
      date: '',
      items: [{ id: 1, description: '', quantity: 1, price: 0 }]
    });
    setShowNewOrderForm(false);
  };

  const addNewOrderItem = () => {
    const newId = Math.max(...newOrder.items.map(item => item.id)) + 1;
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeNewOrderItem = (itemId: number) => {
    if (newOrder.items.length > 1) {
      setNewOrder(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const updateNewOrderItem = (itemId: number, field: keyof OrderItem, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-warning-100 text-warning-800';
      case 'Verificado':
        return 'bg-complement-100 text-complement-800';
      case 'Recibido':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pendiente').length;
  const verifiedOrders = orders.filter(order => order.status === 'Verificado').length;
  const receivedOrders = orders.filter(order => order.status === 'Recibido').length;
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-bg-main pt-16">
      {/* Toggle Mode Section */}
      <div className="px-4 sm:px-6 lg:px-24 mt-4">
        <div className="inline-flex h-10 border border-divider rounded">
          <button
            onClick={() => setActiveMode('scan')}
            className={`w-30 h-10 px-4 text-sm font-medium rounded-l flex items-center justify-center space-x-2 transition-colors ${
              activeMode === 'scan'
                ? 'bg-primary-200 text-black'
                : 'bg-bg-surface text-text-secondary hover:bg-gray-50'
            }`}
          >
            <Receipt size={16} />
            <span>Escaneo</span>
          </button>
          <button
            onClick={() => setActiveMode('purchase')}
            className={`w-30 h-10 px-4 text-sm font-medium rounded-r flex items-center justify-center space-x-2 transition-colors border-l border-divider ${
              activeMode === 'purchase'
                ? 'bg-primary-200 text-black'
                : 'bg-bg-surface text-text-secondary hover:bg-gray-50'
            }`}
          >
            <CreditCard size={16} />
            <span>Orden de Compra</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-24 mt-6">
        {activeMode === 'scan' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Single Panel - Full Width */}
            <div className="w-full">
              <div className="bg-bg-surface border border-dashed border-divider rounded p-4 lg:p-6 min-h-[320px] lg:min-h-[400px] flex flex-col">
                {/* Header with title and action buttons */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm lg:text-base font-medium text-text-primary">
                      Escaneo de Facturas PNG o PDF
                    </h2>
                    <Star size={16} lg:size={18} className="text-primary" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-primary-200 rounded flex items-center justify-center hover:bg-primary-300 transition-colors">
                      <Archive size={16} className="text-text-primary" />
                    </button>
                    <button className="w-8 h-8 bg-bg-surface border border-divider rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <RotateCcw size={16} className="text-text-primary" />
                    </button>
                  </div>
                </div>

                {/* Drop Zone */}
                <div 
                  className={`flex-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 rounded-lg border-2 border-dashed ${
                    isDragOver 
                      ? 'border-primary bg-primary-50 scale-105' 
                      : isUploading
                      ? 'border-complement bg-complement-50'
                      : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-complement mb-4"></div>
                      <p className="text-sm text-complement font-medium">
                        Procesando documento...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={48} className={`mb-4 transition-colors ${
                        isDragOver ? 'text-primary' : 'text-text-secondary'
                      }`} />
                      <p className={`text-sm leading-5 transition-colors ${
                        isDragOver ? 'text-primary font-medium' : 'text-text-secondary'
                      }`}>
                        {isDragOver 
                          ? 'Suelta el archivo aquí'
                          : 'Click to upload or drag and drop\nPDF or images up to 10 MB'
                        }
                      </p>
                    </>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {activeMode === 'purchase' && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left Panel - Orders Table */}
            <div className="xl:col-span-3">
              <div className="bg-bg-surface border border-divider rounded p-4 lg:p-6 min-h-[400px] flex flex-col">
                {!showNewOrderForm ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-medium text-text-primary">Gestor de Órdenes de Compra</h2>
                        <Star size={18} className="text-primary" />
                      </div>
                      <button 
                        onClick={() => setShowNewOrderForm(true)}
                        className="bg-primary hover:bg-primary-600 text-black font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>Nueva Orden</span>
                      </button>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block flex-1 overflow-hidden">
                      <div className="overflow-y-auto max-h-[calc(100%-80px)]">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Fecha
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Proveedor
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Estado
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-bg-surface divide-y divide-divider">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 text-sm text-text-primary">
                                  <div className="flex items-center space-x-2">
                                    <Calendar size={14} className="text-text-secondary" />
                                    <span>{order.date}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-text-primary">
                                  <div className="flex items-center space-x-2">
                                    <User size={14} className="text-text-secondary" />
                                    <span>{order.supplier}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium text-text-primary">
                                  ${order.total.toFixed(2)}
                                </td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <button 
                                    onClick={() => handleOpenOrderModal(order)}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    <MoreVertical size={16} className="text-text-secondary" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex-1 overflow-y-auto space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-divider">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Calendar size={14} className="text-text-secondary" />
                                <span className="text-sm text-text-primary">{order.date}</span>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <User size={14} className="text-text-secondary" />
                                <span className="text-sm font-medium text-text-primary">{order.supplier}</span>
                              </div>
                              <div className="text-lg font-bold text-text-primary">${order.total.toFixed(2)}</div>
                            </div>
                            <button 
                              onClick={() => handleOpenOrderModal(order)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <MoreVertical size={16} className="text-text-secondary" />
                            </button>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* New Order Form */
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-medium text-text-primary">Nueva Orden de Compra</h2>
                      <button 
                        onClick={() => setShowNewOrderForm(false)}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                      >
                        <X size={20} className="text-text-secondary" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Proveedor
                          </label>
                          <input
                            type="text"
                            value={newOrder.supplier}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, supplier: e.target.value }))}
                            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                            placeholder="Nombre del proveedor"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Fecha
                          </label>
                          <input
                            type="date"
                            value={newOrder.date}
                            onChange={(e) => setNewOrder(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-text-primary">
                            Productos
                          </label>
                          <button
                            onClick={addNewOrderItem}
                            className="bg-complement hover:bg-complement-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            <Plus size={14} />
                            <span>Agregar</span>
                          </button>
                        </div>

                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {newOrder.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded border border-divider">
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateNewOrderItem(item.id, 'description', e.target.value)}
                                  placeholder="Descripción"
                                  className="w-full p-2 border border-divider rounded text-sm focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateNewOrderItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  placeholder="Cant."
                                  className="w-full p-2 border border-divider rounded text-sm focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                                  min="1"
                                />
                              </div>
                              <div className="col-span-3">
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => updateNewOrderItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                  placeholder="Precio"
                                  className="w-full p-2 border border-divider rounded text-sm focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                                  step="0.01"
                                  min="0"
                                />
                              </div>
                              <div className="col-span-2 flex justify-end">
                                {newOrder.items.length > 1 && (
                                  <button
                                    onClick={() => removeNewOrderItem(item.id)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <X size={16} className="text-text-secondary" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-text-primary">
                          Total: ${newOrder.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleNewOrderSubmit}
                        disabled={!newOrder.supplier || !newOrder.date || newOrder.items.some(item => !item.description)}
                        className={`flex-1 font-medium py-3 rounded-lg transition-colors ${
                          newOrder.supplier && newOrder.date && newOrder.items.every(item => item.description)
                            ? 'bg-success hover:bg-success-600 text-white'
                            : 'bg-gray-300 text-text-secondary cursor-not-allowed'
                        }`}
                      >
                        Crear Orden
                      </button>
                      <button
                        onClick={() => setShowNewOrderForm(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-text-primary font-medium py-3 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div className="xl:col-span-2">
              <div className="bg-bg-surface border border-divider rounded p-4 lg:p-6 min-h-[400px]">
                <h2 className="text-lg font-medium text-text-primary mb-6">Resumen de Órdenes</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-divider">
                    <div className="text-sm text-text-secondary mb-1">Total de órdenes</div>
                    <div className="text-2xl font-bold text-text-primary">{totalOrders}</div>
                  </div>

                  <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
                    <div className="text-sm text-warning-700 mb-1">Pendientes</div>
                    <div className="text-2xl font-bold text-warning-800">{pendingOrders}</div>
                  </div>

                  <div className="bg-complement-50 p-4 rounded-lg border border-complement-200">
                    <div className="text-sm text-complement-700 mb-1">Verificadas</div>
                    <div className="text-2xl font-bold text-complement-800">{verifiedOrders}</div>
                  </div>

                  <div className="bg-success-50 p-4 rounded-lg border border-success-200">
                    <div className="text-sm text-success-700 mb-1">Recibidas</div>
                    <div className="text-2xl font-bold text-success-800">{receivedOrders}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-divider">
                    <div className="text-sm text-text-secondary mb-1">Valor total</div>
                    <div className="text-2xl font-bold text-text-primary">${totalValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && editedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-divider">
              <h3 className="text-lg font-medium text-text-primary">
                Detalles de Orden #{selectedOrder.id}
              </h3>
              <button
                onClick={handleCloseOrderModal}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Proveedor
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrder.supplier}
                      onChange={(e) => handleOrderFieldChange('supplier', e.target.value)}
                      className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-text-secondary" />
                      <span className="text-text-primary">{selectedOrder.supplier}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Fecha
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedOrder.date}
                      onChange={(e) => handleOrderFieldChange('date', e.target.value)}
                      className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-text-secondary" />
                      <span className="text-text-primary">{selectedOrder.date}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Estado
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.status}
                      onChange={(e) => handleOrderFieldChange('status', e.target.value as 'Pendiente' | 'Verificado' | 'Recibido')}
                      className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Verificado">Verificado</option>
                      <option value="Recibido">Recibido</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-text-primary mb-3">Productos</h4>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border border-divider rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-bg-surface divide-y divide-divider">
                      {editedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                              />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Package size={16} className="text-text-secondary" />
                                <span className="text-sm text-text-primary">{item.description}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                                min="1"
                              />
                            ) : (
                              <span className="text-sm text-text-primary">{item.quantity}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
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
                            ) : (
                              <span className="text-sm text-text-primary">${item.price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-text-primary">
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {editedOrder.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-divider">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">
                            Descripción
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                              className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Package size={16} className="text-text-secondary" />
                              <span className="text-sm text-text-primary">{item.description}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Cantidad
                            </label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-divider rounded focus:ring-2 focus:ring-complement focus:border-transparent text-sm bg-bg-surface text-text-primary"
                                min="1"
                              />
                            ) : (
                              <span className="text-sm text-text-primary">{item.quantity}</span>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Precio
                            </label>
                            {isEditing ? (
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
                            ) : (
                              <span className="text-sm text-text-primary">${item.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm font-medium text-text-primary">
                            Subtotal: ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="text-right mb-6">
                <span className="text-xl font-bold text-text-primary">
                  Total: ${isEditing ? editedOrder.total.toFixed(2) : selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-divider">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="bg-error hover:bg-error-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Eliminar orden
              </button>
              
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 hover:bg-gray-400 text-text-primary px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveOrder}
                      className="bg-success hover:bg-success-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Guardar cambios</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditOrder}
                    className="bg-complement hover:bg-complement-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Editar orden</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInventoryPage;