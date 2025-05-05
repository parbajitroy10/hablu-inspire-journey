
import { User } from '@/types';
import { getLocalData, saveLocalData } from './data';

type AuthResult = {
  success: boolean;
  message?: string;
  user?: User;
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  return getLocalData<User | null>('inspire-current-user', null);
};

// Save current logged in user
export const setCurrentUser = (user: User | null): void => {
  saveLocalData('inspire-current-user', user);
};

// Login function
export const loginUser = (email: string, password: string): AuthResult => {
  const users = getLocalData<User[]>('inspire-users', []);
  const storedPassword = getLocalData<Record<string, string>>('inspire-user-passwords', {});
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, message: 'User not found. Please check your email or sign up.' };
  }
  
  if (storedPassword[user.id] !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  
  // Update last login time
  const updatedUser = { ...user, lastCheckIn: new Date() };
  const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
  saveLocalData('inspire-users', updatedUsers);
  
  // Set as current user
  setCurrentUser(updatedUser);
  
  return { success: true, user: updatedUser };
};

// Logout function
export const logoutUser = (): void => {
  setCurrentUser(null);
};

// Register function
export const registerUser = (user: User, password: string): AuthResult => {
  const users = getLocalData<User[]>('inspire-users', []);
  const storedPasswords = getLocalData<Record<string, string>>('inspire-user-passwords', {});
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { success: false, message: 'Email already in use. Please use a different email or login.' };
  }
  
  // Add user to users list
  const newUsers = [...users, user];
  saveLocalData('inspire-users', newUsers);
  
  // Store password separately for security (in real app, this would be hashed)
  const newPasswords = { ...storedPasswords, [user.id]: password };
  saveLocalData('inspire-user-passwords', newPasswords);
  
  return { success: true };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
