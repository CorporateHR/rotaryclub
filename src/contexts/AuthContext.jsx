import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]');
    
    // Find user
    const foundUser = users.find(u => u.email === email && u.password === password) ||
                     members.find(m => m.email === email && m.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser, isAdmin: foundUser.role === 'admin' || foundUser.isAdmin };
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    // Store as pending registration
    const pendingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      status: 'pending',
      role: 'member',
      createdAt: new Date().toISOString(),
    };
    pendingUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(pendingUsers));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

