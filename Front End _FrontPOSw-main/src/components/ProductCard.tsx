import React from 'react';
import { Package } from 'lucide-react';

interface ProductCardProps {
  name: string;
  id: number;
  onClick: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, id, onClick }) => {
  return (
    <div 
      className="bg-bg-surface rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-105 border border-divider"
      onClick={() => onClick(name)}
    >
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center border-b border-divider">
        <Package size={48} className="text-text-secondary" />
      </div>
      
      {/* Product Info Footer */}
      <div className="bg-primary-50 px-4 py-3 text-center">
        <h3 className="text-sm font-medium text-text-primary truncate">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;