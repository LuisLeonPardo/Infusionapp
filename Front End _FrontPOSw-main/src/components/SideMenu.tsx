import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Home, Plus, Archive, Brain, Settings, LogOut, User } from 'lucide-react';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
      description: 'Página principal'
    },
    {
      name: 'Nuevo Producto',
      icon: Plus,
      path: '/new-product',
      description: 'Agregar producto'
    },
    {
      name: 'Inventario',
      icon: Archive,
      path: '/inventory',
      description: 'Ver inventario'
    },
    {
      name: 'Smart Inventory',
      icon: Brain,
      path: '/smart-inventory',
      description: 'IA para inventario'
    }
  ];

  const bottomMenuItems = [
    {
      name: 'Configuraciones',
      icon: Settings,
      path: '/profile',
      description: 'Ajustes'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-bg-surface md:border-r md:border-divider md:z-40">
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-6 border-b border-divider">
        <Package size={32} className="text-complement mr-3" />
        <span className="text-xl font-bold text-text-primary">
          Inventory Pro
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors group ${
                isActive
                  ? 'bg-complement-50 text-complement-700 border border-complement-200'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              <Icon 
                size={20} 
                className={`mr-3 ${
                  isActive ? 'text-complement-600' : 'text-text-secondary group-hover:text-text-primary'
                }`} 
              />
              <div className="flex-1">
                <div className={`font-medium ${
                  isActive ? 'text-complement-700' : 'text-text-primary'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-divider space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors group ${
                isActive
                  ? 'bg-complement-50 text-complement-700 border border-complement-200'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              <Icon 
                size={20} 
                className={`mr-3 ${
                  isActive ? 'text-complement-600' : 'text-text-secondary group-hover:text-text-primary'
                }`} 
              />
              <div className="flex-1">
                <div className={`font-medium ${
                  isActive ? 'text-complement-700' : 'text-text-primary'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* User Info with Hover Animation */}
      <div className="px-4 py-4 border-t border-divider">
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
        >
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out ${
            showLogout 
              ? 'bg-error-50 border border-error-200 shadow-sm' 
              : 'hover:bg-gray-50'
          }`}>
            <div className="w-8 h-8 bg-complement rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                Juan Pérez
              </div>
              <div className="text-xs text-text-secondary truncate">
                Administrador
              </div>
            </div>
            
            {/* Logout Icon with Animation */}
            <div className={`transition-all duration-300 ease-in-out ${
              showLogout 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-2'
            }`}>
              <LogOut size={16} className="text-error" />
            </div>
          </div>

          {/* Logout Overlay with Animation */}
          <div className={`absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${
            showLogout 
              ? 'opacity-100 bg-error-500 text-white shadow-lg transform scale-100' 
              : 'opacity-0 bg-transparent transform scale-95 pointer-events-none'
          }`}>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 font-medium text-sm"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;