import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllExpenses from './pages/AllExpenses';
import ExpenseDetail from './pages/ExpenseDetail';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Navbar />
            <ChatWidget />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/expenses" 
                element={
                  <PrivateRoute>
                    <AllExpenses />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/expense/:id" 
                element={
                  <PrivateRoute>
                    <ExpenseDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/insights" 
                element={
                  <PrivateRoute>
                    <Insights />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}


export default App;