import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Bitcoin, Banknote } from 'lucide-react';

interface PaymentScreenProps {
  isOpen: boolean;
  onBack: () => void;
  onPaymentSuccess: (method: string) => void;
  total: number;
}

type PaymentMethod = 'card' | 'wallet' | 'crypto' | 'cash';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ isOpen, onBack, onPaymentSuccess, total }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
    cryptoCurrency: 'bitcoin',
    walletAddress: '',
    cashAmount: total.toString(),
    needsChange: false,
    changeFor: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case 'card':
        return formData.cardNumber && formData.expiryDate && formData.cvc && formData.cardName;
      case 'wallet':
        return true; // Wallet payments are handled externally
      case 'crypto':
        return formData.walletAddress;
      case 'cash':
        return formData.cashAmount;
      default:
        return false;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod | null) => {
    switch (method) {
      case 'card':
        return 'Tarjeta de Crédito/Débito';
      case 'wallet':
        return 'Apple Pay / Google Pay';
      case 'crypto':
        return 'Coinbase Pay / Crypto';
      case 'cash':
        return 'Cash on Delivery';
      default:
        return 'Método de pago';
    }
  };

  const handleConfirmPayment = () => {
    if (isFormValid() && selectedMethod) {
      onPaymentSuccess(getPaymentMethodName(selectedMethod));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-main z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-divider bg-bg-surface">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Opciones de Pago</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Total Amount */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-divider">
          <div className="text-center">
            <span className="text-sm text-text-secondary">Total a pagar</span>
            <div className="text-2xl font-bold text-text-primary">$ {total.toFixed(2)}</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-6">
          {/* Credit/Debit Card */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === 'card' ? 'border-complement bg-complement-50' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('card')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'card' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
              <CreditCard size={20} className="text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Tarjeta de Crédito/Débito</div>
                <div className="text-sm text-text-secondary">Visa, Mastercard, American Express</div>
              </div>
            </div>
          </div>

          {/* Apple Pay / Google Pay */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === 'wallet' ? 'border-complement bg-complement-50' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('wallet')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'wallet' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'wallet' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
              <Smartphone size={20} className="text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Apple Pay / Google Pay</div>
                <div className="text-sm text-text-secondary">Pago rápido con tu wallet</div>
              </div>
            </div>
          </div>

          {/* Crypto */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === 'crypto' ? 'border-complement bg-complement-50' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('crypto')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'crypto' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'crypto' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
              <Bitcoin size={20} className="text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Coinbase Pay / Crypto</div>
                <div className="text-sm text-text-secondary">Bitcoin, Ethereum, y más</div>
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === 'cash' ? 'border-complement bg-complement-50' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('cash')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod === 'cash' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'cash' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
              <Banknote size={20} className="text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Cash on Delivery</div>
                <div className="text-sm text-text-secondary">Pago en efectivo al recibir</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Forms */}
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <h3 className="font-medium text-text-primary">Información de la Tarjeta</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  placeholder="MM/AA"
                  className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  placeholder="123"
                  className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                placeholder="Juan Pérez"
                className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-divider">
              <p className="text-text-secondary mb-4">Inicia tu pago con tu wallet</p>
              <div className="bg-gray-200 rounded-lg p-4 text-text-secondary">
                [Botón nativo de Apple Pay / Google Pay]
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'crypto' && (
          <div className="space-y-4">
            <h3 className="font-medium text-text-primary">Pago con Criptomonedas</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Moneda
              </label>
              <select
                value={formData.cryptoCurrency}
                onChange={(e) => handleInputChange('cryptoCurrency', e.target.value)}
                className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              >
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="litecoin">Litecoin (LTC)</option>
                <option value="dogecoin">Dogecoin (DOGE)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Dirección de wallet
              </label>
              <input
                type="text"
                value={formData.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'cash' && (
          <div className="space-y-4">
            <h3 className="font-medium text-text-primary">Pago en Efectivo</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Monto a recibir
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  value={formData.cashAmount}
                  onChange={(e) => handleInputChange('cashAmount', e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="needs-change"
                checked={formData.needsChange}
                onChange={(e) => handleInputChange('needsChange', e.target.checked)}
                className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
              />
              <label htmlFor="needs-change" className="text-sm font-medium text-text-primary">
                Con cambio
              </label>
            </div>

            {formData.needsChange && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Cambio para
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    value={formData.changeFor}
                    onChange={(e) => handleInputChange('changeFor', e.target.value)}
                    placeholder="100.00"
                    className="w-full pl-8 pr-3 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-divider bg-bg-surface">
        <button 
          disabled={!isFormValid()}
          onClick={handleConfirmPayment}
          className={`w-full py-4 rounded-lg font-medium transition-colors ${
            isFormValid()
              ? 'bg-success hover:bg-success-600 text-white'
              : 'bg-gray-300 text-text-secondary cursor-not-allowed'
          }`}
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;