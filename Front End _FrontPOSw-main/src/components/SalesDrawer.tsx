import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

interface SalesItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface SalesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPayment: (total: number) => void;
  productName?: string;
}

const SalesDrawer: React.FC<SalesDrawerProps> = ({ isOpen, onClose, onNavigateToPayment, productName }) => {
  const [items, setItems] = useState<SalesItem[]>([
    { id: 1, name: productName || 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 2, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 3, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 4, name: 'Manta Manual', quantity: 3, price: 18.00 },
  ]);
  
  const [isAdjustableAmount, setIsAdjustableAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  const handlePaymentClick = () => {
    onNavigateToPayment(total);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop/Tablet: Side drawer that pushes content */}
      <div className={`hidden md:block fixed top-0 right-0 h-full bg-bg-surface shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-2/5 lg:w-1/3 border-l border-divider`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <span className="text-lg font-medium text-text-primary">Consumidor final</span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-divider">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-text-primary">{item.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={12} className="text-text-primary" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center text-text-primary">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={12} className="text-text-primary" />
                      </button>
                      <span className="text-sm text-text-secondary ml-2">$ {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-text-primary">$ {(item.quantity * item.price).toFixed(2)}</span>
                    <div className="text-xs text-text-secondary">{item.quantity} Unidades</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Impuestos</span>
                <span className="text-text-primary">$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-divider pt-2">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Toggle */}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setIsAdjustableAmount(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isAdjustableAmount 
                    ? 'bg-complement text-white' 
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Monto Ajustable
              </button>
              <button
                onClick={() => setIsAdjustableAmount(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAdjustableAmount 
                    ? 'bg-complement text-white' 
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Nota interna
              </button>
            </div>

            {/* Custom Amount Input */}
            {!isAdjustableAmount && (
              <div className="mt-4">
                <label htmlFor="custom-amount" className="block text-sm font-medium text-text-primary mb-2">
                  Monto personalizado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    id="custom-amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Text Area for Internal Notes */}
            {isAdjustableAmount && (
              <div className="mt-4">
                <label htmlFor="internal-note" className="block text-sm font-medium text-text-primary mb-2">
                  Nota interna
                </label>
                <textarea
                  id="internal-note"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Escribe aquí tu nota interna..."
                  className="w-full p-3 border border-divider rounded-lg resize-none focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-divider bg-bg-surface">
            <button 
              onClick={handlePaymentClick}
              className="w-full bg-primary hover:bg-primary-600 text-black font-medium py-4 rounded-lg transition-colors"
            >
              Pago
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 bg-bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      } h-3/5 rounded-t-2xl border-t border-divider`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <span className="text-lg font-medium text-text-primary">Consumidor final</span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-divider">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-text-primary">{item.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={12} className="text-text-primary" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center text-text-primary">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={12} className="text-text-primary" />
                      </button>
                      <span className="text-sm text-text-secondary ml-2">$ {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-text-primary">$ {(item.quantity * item.price).toFixed(2)}</span>
                    <div className="text-xs text-text-secondary">{item.quantity} Unidades</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Impuestos</span>
                <span className="text-text-primary">$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-divider pt-2">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Toggle */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setIsAdjustableAmount(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isAdjustableAmount 
                    ? 'bg-complement text-white' 
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Monto Ajustable
              </button>
              <button
                onClick={() => setIsAdjustableAmount(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAdjustableAmount 
                    ? 'bg-complement text-white' 
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Nota interna
              </button>
            </div>

            {/* Custom Amount Input */}
            {!isAdjustableAmount && (
              <div className="mt-4">
                <label htmlFor="custom-amount-mobile" className="block text-sm font-medium text-text-primary mb-2">
                  Monto personalizado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    id="custom-amount-mobile"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Text Area for Internal Notes */}
            {isAdjustableAmount && (
              <div className="mt-4">
                <label htmlFor="internal-note-mobile" className="block text-sm font-medium text-text-primary mb-2">
                  Nota interna
                </label>
                <textarea
                  id="internal-note-mobile"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Escribe aquí tu nota interna..."
                  className="w-full p-3 border border-divider rounded-lg resize-none focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-divider bg-bg-surface rounded-b-2xl">
            <button 
              onClick={handlePaymentClick}
              className="w-full bg-primary hover:bg-primary-600 text-black font-medium py-3 rounded-lg transition-colors"
            >
              Pago
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDrawer;