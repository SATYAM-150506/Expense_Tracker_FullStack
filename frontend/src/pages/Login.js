import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts (only once)
  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn transition-colors`}>
      <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 animate-slideUp`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-primary-400' : 'text-primary-600'} mb-2`}>🔐 Welcome Back</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue managing your expenses
          </p>
        </div>
        
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-danger-50 border-danger-200 text-danger-700'} border px-4 py-3 rounded-lg mb-6`}>
            <span className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </span>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              value={email}
              onChange={onChange}
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-danger-600'}`}>
                {formErrors.email}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              🔒 Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
            />
            {formErrors.password && (
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-danger-600'}`}>
                {formErrors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full btn btn-primary btn-lg" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </span>
            ) : (
              '🚀 Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account? {' '}
            <Link 
              to="/register" 
              className={`font-semibold transition-colors ${isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;