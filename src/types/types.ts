// This file contains typescript types which define rules for data across the app

import { Session } from '@supabase/supabase-js';
import { User as SupabaseUser } from '@supabase/auth-js';
import { ReactNode } from 'react';

export type Post = {
  id: string;
  post_text: string;
  post_img_url: string | null;
  user_id: string;
  username: string;
  users?: PostAuthor;
  tags: string[];
  created_at: Date;
};

export type PostEdge = {
  node: {
    id: string;
    post_text: string;
    post_img_url: string | null;
    user_id: string;
    username: string;
    users?: PostAuthor;
    tags: string;
    created_at: Date;
  };
};

export type FetchPostsData = {
  postsCollection: {
    edges: PostEdge[];
  };
};

export type User = SupabaseUser;

export type FullUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  uid: string;
  dp_url: string | null;
};


export type PostAuthor = {
  name?: string;
  dp_url?: string | null;
};


export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
  username: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User | null;
  name: string;
  session: Session | null;
  error: Error | null;
};

export type AuthContextProps = {
  user: AuthResponse['user'] | null;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null; 
};

export type AuthProviderProps = {
  children: ReactNode;
};



export * from './types.ts';
