import type { IUser } from '@/interface/Iuser';
import { create } from 'zustand';

export interface UserState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

// Main user store for current authenticated user
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: IUser | null) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// Optional: Store for managing multiple users (if needed for admin features)
const usersGlobalStore = create((set) => ({
  users: [],
  setUsers: (payload: IUser[]) => set({ users: payload }),
}))

export default usersGlobalStore;