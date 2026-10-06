export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}
