import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import SalesDrawer from './SalesDrawer';
import PaymentScreen from './PaymentScreen';
import PaymentSuccessScreen from './PaymentSuccessScreen';

interface HomePageProps {
  searchTerm?: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchTerm: externalSearchTerm = '' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 2, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 3, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
    { id: 4, name: 'Manta Manual', quantity: 3, price: 18.00 },
  ]);

  // Use local search term (takes priority over external)
  const activeSearchTerm = localSearchTerm || externalSearchTerm;

  // Mock data for demonstration with more variety
  const products = [
    { id: 1, name: 'Cabinet with Doors' },
    { id: 2, name: 'Escritorio Ejecutivo' },
    { id: 3, name: 'Silla Ergonómica' },
    { id: 4, name: 'Lámpara LED' },
    { id: 5, name: 'Monitor 24 pulgadas' },
    { id: 6, name: 'Teclado Mecánico' },
    { id: 7, name: 'Manta Manual' },
    { id: 8, name: 'Alfombra Persa' },
    { id: 9, name: 'Mesa de Centro' },
    { id: 10, name: 'Estantería Modular' },
    { id: 11, name: 'Cojines Decorativos' },
    { id: 12, name: 'Espejo de Pared' },
  ];

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      return products;
    }
    
    return products.filter(product =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  }, [activeSearchTerm]);

  const handleProductClick = (productName: string) => {
    setSelectedProduct(productName);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNavigateToPayment = (total: number) => {
    setPaymentTotal(total);
    setIsPaymentOpen(true);
  };

  const handleBackFromPayment = () => {
    setIsPaymentOpen(false);
  };

  const handlePaymentSuccess = (method: string) => {
    setPaymentMethod(method);
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
  };

  const handleNewOrder = () => {
    // Reset all states to start fresh
    setIsSuccessOpen(false);
    setIsDrawerOpen(false);
    setIsPaymentOpen(false);
    setSelectedProduct('');
    setPaymentTotal(0);
    setPaymentMethod('');
    // Reset cart items to initial state
    setCartItems([
      { id: 1, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
      { id: 2, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
      { id: 3, name: 'Cabinet with Doors', quantity: 3, price: 18.00 },
      { id: 4, name: 'Manta Manual', quantity: 3, price: 18.00 },
    ]);
  };

  const handleLocalSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  return (
    <>
      <div className={`py-8 transition-all duration-300 ${
        isDrawerOpen && !isPaymentOpen && !isSuccessOpen ? 'md:mr-[40%] lg:mr-[33.333333%]' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            {/* Title and Search Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">
                Tablero de Venta
              </h1>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={(e) => handleLocalSearchChange(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border border-divider rounded-lg text-sm focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary"
                />
              </div>
            </div>
            
            {/* Description */}
            <p className="text-text-secondary">
              {activeSearchTerm ? (
                <>
                  Mostrando {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{activeSearchTerm}"
                </>
              ) : (
                'Selecciona productos para crear órdenes de venta rápidamente'
              )}
            </p>
          </div>

          {/* Responsive Grid with white background */}
          <div className="bg-white p-6 rounded-lg border border-divider">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-text-secondary mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-text-secondary">
                  No hay productos que coincidan con "{activeSearchTerm}". Intenta con otros términos de búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SalesDrawer 
        isOpen={isDrawerOpen && !isPaymentOpen && !isSuccessOpen}
        onClose={handleCloseDrawer}
        onNavigateToPayment={handleNavigateToPayment}
        productName={selectedProduct}
      />

      <PaymentScreen
        isOpen={isPaymentOpen}
        onBack={handleBackFromPayment}
        onPaymentSuccess={handlePaymentSuccess}
        total={paymentTotal}
      />

      <PaymentSuccessScreen
        isOpen={isSuccessOpen}
        onNewOrder={handleNewOrder}
        paymentMethod={paymentMethod}
        total={paymentTotal}
        items={cartItems}
      />
    </>
  );
};

export default HomePage;