import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  registerUser, 
  loginUser, 
  signOut, 
  getCurrentUser, 
  onAuthChanged 
} from '../services/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Initial auth state
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const result = await registerUser(email, password);
      if (result && result.user) {
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser(email, password);
      if (result && result.user) {
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 