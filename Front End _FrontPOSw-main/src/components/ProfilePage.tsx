import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Eye, 
  EyeOff, 
  Globe, 
  Clock, 
  DollarSign, 
  Bell, 
  CreditCard, 
  Download, 
  HelpCircle, 
  MessageSquare, 
  Activity, 
  LogOut, 
  Trash2, 
  Save,
  Camera,
  Smartphone,
  Monitor,
  Check,
  X,
  Plus,
  Edit3
} from 'lucide-react';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente' | 'Vencido';
}

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+1 (555) 123-4567',
    address: 'Av. Principal 123, Ciudad, País',
    role: 'Administrador',
    lastAccess: '2024-01-15 14:30',
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    language: 'es',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD',
    notifications: {
      lowStock: { email: true, inApp: true },
      newOrders: { email: true, inApp: true },
      paymentCompleted: { email: false, inApp: true },
      ocrErrors: { email: true, inApp: false }
    },
    notificationFrequency: 'immediate'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [sessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro - Chrome',
      location: 'Ciudad de México, México',
      lastActive: 'Ahora',
      current: true
    },
    {
      id: '2',
      device: 'iPhone 14 - Safari',
      location: 'Ciudad de México, México',
      lastActive: 'Hace 2 horas',
      current: false
    },
    {
      id: '3',
      device: 'Windows PC - Edge',
      location: 'Guadalajara, México',
      lastActive: 'Hace 1 día',
      current: false
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    { id: 'INV-2024-001', date: '2024-01-01', amount: 29.99, status: 'Pagado' },
    { id: 'INV-2023-012', date: '2023-12-01', amount: 29.99, status: 'Pagado' },
    { id: 'INV-2023-011', date: '2023-11-01', amount: 29.99, status: 'Pagado' },
    { id: 'INV-2023-010', date: '2023-10-01', amount: 29.99, status: 'Vencido' }
  ]);

  // Payment cards state
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '25',
      holderName: 'Juan Pérez',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      lastFour: '8888',
      expiryMonth: '08',
      expiryYear: '26',
      holderName: 'Juan Pérez',
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: ''
  });

  const sections = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'personal', name: 'Datos Personales', icon: User },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'preferences', name: 'Preferencias', icon: Globe },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'billing', name: 'Plan y Facturación', icon: CreditCard },
    { id: 'support', name: 'Soporte y Ayuda', icon: HelpCircle }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: string, field: string, subfield: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: {
          ...(prev[parent as keyof typeof prev] as any)[field],
          [subfield]: value
        }
      }
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChanges = () => {
    // Simulate save
    console.log('Guardando cambios...', profileData);
  };

  const handleCloseSession = (sessionId: string) => {
    console.log('Cerrando sesión:', sessionId);
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setShowAddCardForm(false);
    setEditingCard(null);
    setNewCard({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: ''
    });
  };

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentCards(cards =>
      cards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    if (paymentCards.length <= 1) {
      alert('Debes tener al menos una tarjeta registrada');
      return;
    }
    
    const cardToDelete = paymentCards.find(card => card.id === cardId);
    if (cardToDelete?.isDefault) {
      // Set another card as default
      const otherCard = paymentCards.find(card => card.id !== cardId);
      if (otherCard) {
        setPaymentCards(cards =>
          cards.filter(card => card.id !== cardId)
            .map(card => card.id === otherCard.id ? { ...card, isDefault: true } : card)
        );
      }
    } else {
      setPaymentCards(cards => cards.filter(card => card.id !== cardId));
    }
  };

  const handleEditCard = (card: PaymentCard) => {
    setEditingCard(card);
    setNewCard({
      number: `•••• •••• •••• ${card.lastFour}`,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cvc: '',
      holderName: card.holderName
    });
    setShowAddCardForm(true);
  };

  const handleSaveCard = () => {
    if (!newCard.holderName || !newCard.expiryMonth || !newCard.expiryYear) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (editingCard) {
      // Update existing card
      setPaymentCards(cards =>
        cards.map(card =>
          card.id === editingCard.id
            ? {
                ...card,
                expiryMonth: newCard.expiryMonth,
                expiryYear: newCard.expiryYear,
                holderName: newCard.holderName
              }
            : card
        )
      );
    } else {
      // Add new card
      if (!newCard.number || !newCard.cvc) {
        alert('Por favor completa todos los campos para la nueva tarjeta');
        return;
      }

      const lastFour = newCard.number.replace(/\s/g, '').slice(-4);
      const cardType = newCard.number.startsWith('4') ? 'visa' : 
                      newCard.number.startsWith('5') ? 'mastercard' : 'amex';

      const newCardData: PaymentCard = {
        id: Date.now().toString(),
        type: cardType,
        lastFour,
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        holderName: newCard.holderName,
        isDefault: paymentCards.length === 0
      };

      setPaymentCards(cards => [...cards, newCardData]);
    }

    setShowAddCardForm(false);
    setEditingCard(null);
    setNewCard({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: ''
    });
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>;
      case 'mastercard':
        return <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>;
      case 'amex':
        return <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>;
      default:
        return <CreditCard size={20} className="text-text-secondary" />;
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado':
        return 'bg-success-100 text-success-800';
      case 'Pendiente':
        return 'bg-warning-100 text-warning-800';
      case 'Vencido':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProfileHeader = () => (
    <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 bg-complement rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
            <Camera size={16} className="text-black" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text-primary">{profileData.name}</h2>
          <p className="text-text-secondary">{profileData.email}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-complement-100 text-complement-800">
              {profileData.role}
            </span>
            <span className="text-sm text-text-secondary">
              Último acceso: {profileData.lastAccess}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalData = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Correo electrónico
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="flex-1 p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
            />
            <button className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              profileData.emailVerified 
                ? 'bg-success-100 text-success-800 cursor-default'
                : 'bg-complement hover:bg-complement-600 text-white'
            }`}>
              {profileData.emailVerified ? 'Verificado' : 'Verificar'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Teléfono
          </label>
          <div className="flex space-x-2">
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="flex-1 p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
            />
            <button className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              profileData.phoneVerified 
                ? 'bg-success-100 text-success-800 cursor-default'
                : 'bg-complement hover:bg-complement-600 text-white'
            }`}>
              {profileData.phoneVerified ? 'Verificado' : 'Verificar SMS'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Dirección completa
          </label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Cambiar contraseña</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
                className="w-full p-3 pr-12 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                className="w-full p-3 pr-12 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                className="w-full p-3 pr-12 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Factor Authentication */}
      <div className="border-t border-divider pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-text-primary">Autenticación de dos factores</h3>
            <p className="text-sm text-text-secondary">Añade una capa extra de seguridad a tu cuenta</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profileData.twoFactorEnabled}
              onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-complement-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-complement"></div>
          </label>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border-t border-divider pt-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Sesiones activas</h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-divider">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {session.device.includes('iPhone') ? (
                    <Smartphone size={20} className="text-text-secondary" />
                  ) : (
                    <Monitor size={20} className="text-text-secondary" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-text-primary">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800">
                        Actual
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {session.location} • {session.lastActive}
                  </div>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleCloseSession(session.id)}
                  className="px-3 py-1 text-sm text-error hover:bg-error-50 rounded transition-colors"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Idioma
          </label>
          <select
            value={profileData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Zona horaria
          </label>
          <select
            value={profileData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          >
            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
            <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Formato de fecha
          </label>
          <select
            value={profileData.dateFormat}
            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Moneda predeterminada
          </label>
          <select
            value={profileData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
          >
            <option value="USD">USD - Dólar estadounidense</option>
            <option value="MXN">MXN - Peso mexicano</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - Libra esterlina</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Tipos de notificaciones</h3>
        <div className="space-y-4">
          {Object.entries(profileData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-divider">
              <div>
                <div className="font-medium text-text-primary">
                  {key === 'lowStock' && 'Stock bajo'}
                  {key === 'newOrders' && 'Nuevas órdenes'}
                  {key === 'paymentCompleted' && 'Pago completado'}
                  {key === 'ocrErrors' && 'Errores OCR'}
                </div>
                <div className="text-sm text-text-secondary">
                  {key === 'lowStock' && 'Cuando un producto tenga stock bajo'}
                  {key === 'newOrders' && 'Cuando se reciba una nueva orden'}
                  {key === 'paymentCompleted' && 'Cuando se complete un pago'}
                  {key === 'ocrErrors' && 'Cuando ocurra un error en el OCR'}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value.email}
                    onChange={(e) => handleNestedInputChange('notifications', key, 'email', e.target.checked)}
                    className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                  />
                  <span className="text-sm text-text-secondary">Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value.inApp}
                    onChange={(e) => handleNestedInputChange('notifications', key, 'inApp', e.target.checked)}
                    className="w-4 h-4 text-complement border-gray-300 rounded focus:ring-complement"
                  />
                  <span className="text-sm text-text-secondary">In-App</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="border-t border-divider pt-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Frecuencia</h3>
        <select
          value={profileData.notificationFrequency}
          onChange={(e) => handleInputChange('notificationFrequency', e.target.value)}
          className="w-full md:w-auto p-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary"
        >
          <option value="immediate">Inmediata</option>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
        </select>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gray-50 rounded-lg p-6 border border-divider">
        <h3 className="text-lg font-medium text-text-primary mb-2">Plan actual</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">Plan Pro</div>
            <div className="text-text-secondary">$29.99/mes • Hasta 10,000 productos</div>
          </div>
          <button className="bg-complement hover:bg-complement-600 text-white px-4 py-2 rounded-lg transition-colors">
            Cambiar plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Método de pago</h3>
          <button 
            onClick={handleOpenPaymentModal}
            className="bg-secondary hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors">
            Actualizar método
          </button>
        </div>
        
        {/* Display default card */}
        {paymentCards.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-divider">
            <div className="flex items-center space-x-3">
              {getCardIcon(paymentCards.find(card => card.isDefault)?.type || 'visa')}
              <div>
                <div className="font-medium text-text-primary">
                  •••• •••• •••• {paymentCards.find(card => card.isDefault)?.lastFour}
                </div>
                <div className="text-sm text-text-secondary">
                  {paymentCards.find(card => card.isDefault)?.type.charAt(0).toUpperCase() + 
                   paymentCards.find(card => card.isDefault)?.type.slice(1)} • 
                  Expira {paymentCards.find(card => card.isDefault)?.expiryMonth}/{paymentCards.find(card => card.isDefault)?.expiryYear}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">Historial de facturas</h3>
        <div className="bg-bg-surface rounded-lg border border-divider overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-4 text-sm text-text-primary">{invoice.date}</td>
                  <td className="px-4 py-4 text-sm font-medium text-text-primary">${invoice.amount}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-complement hover:text-complement-600 text-sm font-medium">
                      <Download size={16} className="inline mr-1" />
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-gray-50 rounded-lg border border-divider hover:bg-gray-100 transition-colors text-left">
          <HelpCircle size={32} className="text-complement mb-3" />
          <h3 className="font-medium text-text-primary mb-2">Centro de ayuda</h3>
          <p className="text-sm text-text-secondary">Encuentra respuestas a preguntas frecuentes</p>
        </button>

        <button className="p-6 bg-gray-50 rounded-lg border border-divider hover:bg-gray-100 transition-colors text-left">
          <MessageSquare size={32} className="text-complement mb-3" />
          <h3 className="font-medium text-text-primary mb-2">Enviar feedback</h3>
          <p className="text-sm text-text-secondary">Comparte tus comentarios y sugerencias</p>
        </button>

        <button className="p-6 bg-gray-50 rounded-lg border border-divider hover:bg-gray-100 transition-colors text-left">
          <Activity size={32} className="text-complement mb-3" />
          <h3 className="font-medium text-text-primary mb-2">Estado del sistema</h3>
          <p className="text-sm text-text-secondary">Verifica el estado de nuestros servicios</p>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileHeader();
      case 'personal':
        return renderPersonalData();
      case 'security':
        return renderSecurity();
      case 'preferences':
        return renderPreferences();
      case 'notifications':
        return renderNotifications();
      case 'billing':
        return renderBilling();
      case 'support':
        return renderSupport();
      default:
        return renderProfileHeader();
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pt-16">
      {/* Header */}
      <div className="bg-bg-surface shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors md:hidden"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </button>
              <h1 className="text-xl font-semibold text-text-primary">Mi Perfil</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-4 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-complement-50 text-complement-700 border border-complement-200'
                          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile/Tablet Accordion */}
          <div className="lg:hidden mb-6">
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider overflow-hidden">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-divider last:border-b-0 ${
                        isActive ? 'bg-complement-50 text-complement-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={18} />
                        <span className="font-medium">{section.name}</span>
                      </div>
                      <div className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-bg-surface rounded-lg shadow-sm border border-divider p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                {sections.find(s => s.id === activeSection)?.name}
              </h2>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-divider p-4 md:pl-64">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <button
            onClick={handleSaveChanges}
            className="bg-primary hover:bg-primary-600 text-black font-medium py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-divider">
              <h3 className="text-lg font-medium text-text-primary">
                Gestionar Métodos de Pago
              </h3>
              <button
                onClick={handleClosePaymentModal}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-text-secondary">Payment modal content goes here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;