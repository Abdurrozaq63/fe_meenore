export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserResponse extends User {}
