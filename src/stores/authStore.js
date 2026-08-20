import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  
  login: async (email, password) => {
    const response = await authService.login(email, password);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token });
    return response.data;
  },
  
  register: async (email, password, firstName, lastName, phoneNumber, address) => {
    const response = await authService.register(email, password, firstName, lastName, phoneNumber, address);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  
  setUser: (user) => set({ user }),
}));
