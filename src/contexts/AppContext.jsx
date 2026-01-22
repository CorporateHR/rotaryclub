import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('login');

  const value = {
    currentView,
    setCurrentView,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

