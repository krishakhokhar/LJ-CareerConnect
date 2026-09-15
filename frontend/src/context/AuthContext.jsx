import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

const ROLE_HOME = {
  ADMIN: '/admin/dashboard',
  STUDENT: '/student/dashboard',
  RECRUITER: '/recruiter/dashboard',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem('lj_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (error) {
      localStorage.removeItem('lj_token');
      localStorage.removeItem('lj_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const persistSession = (data) => {
    localStorage.setItem('lj_token', data.token);
    localStorage.setItem('lj_user', JSON.stringify(data.user));
    setUser(data.user);
    setProfile(data.profile);
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    persistSession(data);
    return data;
  };

  const registerStudent = async (payload) => {
    const data = await authService.registerStudent(payload);
    persistSession(data);
    return data;
  };

  const registerRecruiter = async (payload) => {
    const data = await authService.registerRecruiter(payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('lj_token');
    localStorage.removeItem('lj_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    const data = await authService.getMe();
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    homePath: user ? ROLE_HOME[user.role] : '/',
    login,
    registerStudent,
    registerRecruiter,
    logout,
    refreshProfile,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
