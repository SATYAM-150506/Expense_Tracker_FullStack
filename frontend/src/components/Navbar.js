import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors">
            <div className="text-2xl">💰</div>
            <span className="text-xl font-bold">Expense Tracker</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-8">
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') || isActive('/') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/expenses" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/expenses') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>📊</span>
                    <span>All Expenses</span>
                  </Link>
                </li>
              </ul>
              
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {getUserInitials(user?.name)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <ul className="flex space-x-4">
              <li>
                <Link 
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <span>🔑</span>
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/register"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/register') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <span>📝</span>
                  <span>Register</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;