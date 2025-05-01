export type UserRole = 'admin' | 'manager' | 'client'; 
export type UserStatus = 'approved' | 'pending' |'locked';

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: 'admin' | 'manager' | 'client';
    status:UserStatus;
    permissions: string[];
    organization?: string; // Optional for managers
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Optional: Different DTOs if needed
  export interface UserDto {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    status: string;
  }
  
  export interface UpdateUserStatusDto {
    locked: boolean;
  }
  
  export interface UpdatePermissionsDto {
    permissions: string[];
  }