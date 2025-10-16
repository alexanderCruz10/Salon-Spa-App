export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
  createdAt?: string;
  updatedAt?: string;
}