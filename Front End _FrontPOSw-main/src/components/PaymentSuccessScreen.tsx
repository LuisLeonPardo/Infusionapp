import React, { useState, useEffect } from 'react';
import { Check, Download, Mail, ArrowLeft } from 'lucide-react';

interface PaymentSuccessScreenProps {
  isOpen: boolean;
  onNewOrder: () => void;
  paymentMethod: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ 
  isOpen, 
  onNewOrder, 
  paymentMethod, 
  total, 
  items 
}) => {
  const [email, setEmail] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animations
      setTimeout(() => setShowCheckmark(true), 200);
      setTimeout(() => setShowConfetti(true), 600);
    } else {
      setShowCheckmark(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.15;
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('es-ES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-main z-50 flex flex-col">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-divider bg-bg-surface relative">
        <h1 className="text-lg font-semibold text-text-primary">Pago Exitoso</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Success Banner */}
            <div className="flex flex-col items-center justify-center space-y-6 lg:pr-8">
              
              {/* Animated Checkmark */}
              <div className={`relative transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}>
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center">
                  <Check size={48} className="text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-success rounded-full animate-ping opacity-20"></div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">¡Pago Confirmado!</h2>
                <p className="text-text-secondary">Tu transacción se ha procesado exitosamente</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-divider">
                  <span className="text-sm text-text-secondary">Método de pago: </span>
                  <span className="font-medium text-text-primary">{paymentMethod}</span>
                </div>
              </div>

              {/* Email Section */}
              <div className="w-full max-w-md space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Enviar factura por correo
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. ejemplo@mail.com"
                    className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-secondary hover:bg-secondary-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Download size={20} />
                    <span>Descargar PDF</span>
                  </button>
                  
                  <button 
                    disabled={!email}
                    className={`w-full font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      email 
                        ? 'bg-success hover:bg-success-600 text-white' 
                        : 'bg-gray-300 text-text-secondary cursor-not-allowed'
                    }`}
                  >
                    <Mail size={20} />
                    <span>Enviar por correo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Invoice */}
            <div className="lg:pl-8 lg:border-l border-divider">
              <div className="bg-bg-surface border border-divider rounded-lg shadow-sm p-6">
                
                {/* Invoice Header */}
                <div className="border-b border-divider pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">FACTURA</h3>
                      <p className="text-sm text-text-secondary">#{invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-secondary">Fecha: {currentDate}</p>
                      <p className="text-sm text-text-secondary">Inventory Pro</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-medium text-text-primary mb-2">Facturado a:</h4>
                  <div className="bg-gray-50 p-3 rounded border border-divider">
                    <p className="text-sm text-text-primary">Consumidor Final</p>
                    <p className="text-sm text-text-secondary">Venta al por menor</p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-6">
                  <h4 className="font-medium text-text-primary mb-3">Artículos:</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{item.name}</p>
                          <p className="text-xs text-text-secondary">{item.quantity} x ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-text-primary">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal:</span>
                    <span className="text-text-primary">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Impuestos (15%):</span>
                    <span className="text-text-primary">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-divider pt-2">
                    <span className="text-text-primary">Total:</span>
                    <span className="text-text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Invoice Footer */}
                <div className="border-t border-divider pt-4">
                  <div className="text-center text-xs text-text-secondary space-y-1">
                    <p>Gracias por su compra</p>
                    <p>Inventory Pro - Sistema de Gestión</p>
                    <p>Para soporte: soporte@inventorypro.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="border-t border-divider p-4 bg-bg-surface">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onNewOrder}
            className="w-full bg-primary hover:bg-primary-600 text-black font-medium py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;