import React from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = (role: 'manager' | 'member') => {
    login({
      id: crypto.randomUUID(),
      name: role === 'manager' ? 'John Manager' : 'Jane Member',
      email: `${role}@example.com`,
      role,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Daily Reports</h1>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('manager')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Continue as Manager
          </button>
          <button
            onClick={() => handleLogin('member')}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Continue as Team Member
          </button>
        </div>
      </div>
    </div>
  );
}