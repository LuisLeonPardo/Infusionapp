import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to homepage
    navigate('/');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Navigate to homepage
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6 min-h-screen">
        {/* Left Column - Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Welcome Back 👋
              </h1>
              <p className="text-text-secondary leading-relaxed">
                Today is a new day. It's your day. You shape it.<br />
                Sign in to start managing your projects.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Example@email.com"
                  className="w-full h-12 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="at least 8 characters"
                  className="w-full h-12 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-complement hover:text-complement-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                onClick={() => navigate('/')}
                className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02]"
              >
                Sign in
              </button>
            </form>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-divider"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-main text-text-secondary">Or</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-text-primary font-medium">Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-text-primary font-medium">Sign in with Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Don't you have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-complement hover:text-complement-600 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-xs text-text-secondary">
                © 2024 ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full h-full max-h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center border border-divider">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Inventory Management
              </h3>
              <p className="text-text-secondary">
                Manage your inventory with ease and efficiency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout (768px - 1024px) */}
      <div className="hidden md:block lg:hidden">
        <div className="min-h-screen">
          {/* Check if screen is wide enough for 2 columns */}
          <div className="hidden xl:grid xl:grid-cols-2 xl:gap-6 xl:p-6 min-h-screen">
            {/* Same as desktop layout */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Welcome Back 👋
                  </h1>
                  <p className="text-text-secondary leading-relaxed">
                    Today is a new day. It's your day. You shape it.<br />
                    Sign in to start managing your projects.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Example@email.com"
                      className="w-full h-12 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="at least 8 characters"
                      className="w-full h-12 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-complement hover:text-complement-600 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    onClick={() => navigate('/')}
                    className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02]"
                  >
                    Sign in
                  </button>
                </form>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-divider"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-bg-main text-text-secondary">Or</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
                  >
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-text-primary font-medium">Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span className="text-text-primary font-medium">Sign in with Facebook</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-text-secondary">
                    Don't you have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-complement hover:text-complement-600 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-xs text-text-secondary">
                    © 2024 ALL RIGHTS RESERVED
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="flex items-center justify-center p-6">
              <div className="w-full h-full max-h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center border border-divider">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Inventory Management
                  </h3>
                  <p className="text-text-secondary">
                    Manage your inventory with ease and efficiency
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stacked layout for smaller tablets */}
          <div className="xl:hidden p-6 space-y-8">
            {/* Form Section */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Welcome Back 👋
                  </h1>
                  <p className="text-text-secondary leading-relaxed">
                    Today is a new day. It's your day. You shape it.<br />
                    Sign in to start managing your projects.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Example@email.com"
                      className="w-full h-12 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="at least 8 characters"
                      className="w-full h-12 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-complement hover:text-complement-600 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    onClick={() => navigate('/')}
                    className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-[1.02]"
                  >
                    Sign in
                  </button>
                </form>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-divider"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-bg-main text-text-secondary">Or</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
                  >
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-text-primary font-medium">Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span className="text-text-primary font-medium">Sign in with Facebook</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-text-secondary">
                    Don't you have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-complement hover:text-complement-600 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-xs text-text-secondary">
                    © 2024 ALL RIGHTS RESERVED
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image Section */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-80 bg-gray-100 rounded-2xl flex items-center justify-center border border-divider">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Inventory Management
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Manage your inventory with ease
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (<768px) */}
      <div className="md:hidden min-h-screen p-4 space-y-6">
        {/* Form Section */}
        <div className="pt-8">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-text-primary mb-4">
                Welcome Back 👋
              </h1>
              <p className="text-text-secondary leading-relaxed text-sm">
                Today is a new day. It's your day. You shape it.
                Sign in to start managing your projects.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Example@email.com"
                  className="w-full h-12 px-4 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="at least 8 characters"
                  className="w-full h-12 px-4 pr-12 border border-divider rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ease-in-out bg-bg-surface text-text-primary placeholder-text-secondary hover:shadow-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-complement hover:text-complement-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                onClick={() => navigate('/')}
                className="w-full h-11 bg-primary hover:bg-primary-600 text-black font-medium rounded transition-all duration-150 ease-in-out hover:shadow-md"
              >
                Sign in
              </button>
            </form>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-divider"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-main text-text-secondary">Or</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-text-primary font-medium">Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full h-10 bg-bg-surface border border-divider rounded flex items-center justify-center space-x-3 hover:shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-text-primary font-medium">Sign in with Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Don't you have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-complement hover:text-complement-600 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-xs text-text-secondary">
                © 2024 ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="pb-8">
          <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center border border-divider">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                Inventory Management
              </h3>
              <p className="text-sm text-text-secondary px-4">
                Manage your inventory with ease
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;