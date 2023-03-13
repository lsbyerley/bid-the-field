export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      auctions: {
        Row: {
          created_at: string | null;
          data_filename: string | null;
          description: string | null;
          end_date: string;
          id: number;
          name: string;
          payouts: string | null;
          rules: string | null;
          sport: string;
          start_date: string;
        };
        Insert: {
          created_at?: string | null;
          data_filename?: string | null;
          description?: string | null;
          end_date: string;
          id?: number;
          name: string;
          payouts?: string | null;
          rules?: string | null;
          sport: string;
          start_date: string;
        };
        Update: {
          created_at?: string | null;
          data_filename?: string | null;
          description?: string | null;
          end_date?: string;
          id?: number;
          name?: string;
          payouts?: string | null;
          rules?: string | null;
          sport?: string;
          start_date?: string;
        };
      };
      bids: {
        Row: {
          amount: number;
          auction_id: number;
          created_at: string | null;
          id: number;
          owner_id: string;
          player_id: string;
        };
        Insert: {
          amount: number;
          auction_id: number;
          created_at?: string | null;
          id?: number;
          owner_id: string;
          player_id: string;
        };
        Update: {
          amount?: number;
          auction_id?: number;
          created_at?: string | null;
          id?: number;
          owner_id?: string;
          player_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          name: string | null;
          phone: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          name?: string | null;
          phone?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string | null;
          phone?: string | null;
          username?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
