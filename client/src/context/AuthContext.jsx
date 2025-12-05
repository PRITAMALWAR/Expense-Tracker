import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'admin@gmail.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('set_token');
      const storedUserRaw = localStorage.getItem('set_user');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        // Always trust backend user (ensures latest role value)
        const res = await authApi.me();
        let freshUser = res.data.user || null;
        if (
          freshUser &&
          (!freshUser.role ||
            freshUser.role !== 'admin') &&
          typeof freshUser.email === 'string' &&
          freshUser.email.toLowerCase() === ADMIN_EMAIL
        ) {
          // Normalize admin user on client side if backend role is missing
          freshUser = { ...freshUser, role: 'admin' };
        }
        setUser(freshUser);
        if (freshUser) {
          localStorage.setItem('set_user', JSON.stringify(freshUser));
        } else if (storedUserRaw) {
          localStorage.removeItem('set_user');
        }
      } catch (err) {
        // Token invalid/expired – clear auth state
        localStorage.removeItem('set_token');
        localStorage.removeItem('set_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = (userData, jwt) => {
    let normalizedUser = userData;
    if (
      normalizedUser &&
      (!normalizedUser.role ||
        normalizedUser.role !== 'admin') &&
      typeof normalizedUser.email === 'string' &&
      normalizedUser.email.toLowerCase() === ADMIN_EMAIL
    ) {
      normalizedUser = { ...normalizedUser, role: 'admin' };
    }
    setUser(normalizedUser);
    setToken(jwt);
    localStorage.setItem('set_token', jwt);
    localStorage.setItem('set_user', JSON.stringify(normalizedUser));
    toast.success('Logged in');
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('set_token');
    localStorage.removeItem('set_user');
    toast.success('Logged out');
    navigate('/login');
  };

  const isAuthenticated = !!token;
  const isAdmin = !!user && user.role === 'admin';

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


