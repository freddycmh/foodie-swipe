import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

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
    // Simulate authentication loading
    const timer = setTimeout(() => {
      // Set a mock user to bypass authentication
      setUser({
        uid: 'demo-user-123',
        email: 'demo@foodieswipe.com',
        displayName: 'Demo User'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    console.log('Logout disabled in demo mode');
    // For demo purposes, you could uncomment the line below to allow logout
    // setUser(null);
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    isDemoMode: true, // Flag to indicate demo mode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;