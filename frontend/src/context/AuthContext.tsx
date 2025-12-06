import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface User {
  email: string;
  approved: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sat_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      checkApproval(parsed.email).then(approved => {
        if (approved) {
          setUser({ email: parsed.email, approved: true });
        } else {
          localStorage.removeItem('sat_user');
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkApproval = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.approved === true;
    } catch {
      return false;
    }
  };

  const login = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await response.json();

      if (data.approved) {
        const userData = { email: email.toLowerCase().trim(), approved: true };
        setUser(userData);
        localStorage.setItem('sat_user', JSON.stringify(userData));
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'This email is not approved. Please make sure you signed up on Skool first.' };
      }
    } catch {
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sat_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
