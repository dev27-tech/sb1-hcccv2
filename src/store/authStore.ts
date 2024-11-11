import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs-react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
  department?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'manager' | 'member';
    department?: string;
  }) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
}

interface StoredUser extends User {
  passwordHash: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      login: async (email, password) => {
        const state = get() as any;
        const storedUser = state.users.find((u: StoredUser) => u.email === email);
        
        if (!storedUser) {
          throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(password, storedUser.passwordHash);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        const user: User = {
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          role: storedUser.role,
          department: storedUser.department,
          avatar: storedUser.avatar,
          createdAt: storedUser.createdAt
        };

        set({ user });
        return user;
      },
      logout: () => set({ user: null }),
      register: async (userData) => {
        const state = get() as any;
        const existingUser = state.users.find((u: StoredUser) => u.email === userData.email);
        
        if (existingUser) {
          throw new Error('Email already registered');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userData.password, salt);

        const newUser: StoredUser = {
          id: uuidv4(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          passwordHash,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
          createdAt: new Date().toISOString()
        };

        set((state: any) => ({
          users: [...state.users, newUser]
        }));

        const user: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt
        };

        return user;
      },
      resetPassword: async (email) => {
        const state = get() as any;
        const user = state.users.find((u: StoredUser) => u.email === email);
        
        if (!user) {
          throw new Error('User not found');
        }

        // In a real app, send reset email
        // For demo, we'll just generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(tempPassword, salt);

        set((state: any) => ({
          users: state.users.map((u: StoredUser) =>
            u.email === email ? { ...u, passwordHash } : u
          )
        }));

        console.log('Temporary password:', tempPassword);
      },
      updatePassword: async (email, newPassword) => {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        set((state: any) => ({
          users: state.users.map((u: StoredUser) =>
            u.email === email ? { ...u, passwordHash } : u
          )
        }));
      }
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
);