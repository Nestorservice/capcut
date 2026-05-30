export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  cloudinary_folder: string | null;
  storage_used: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  username: string;
  display_name?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
