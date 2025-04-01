export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          note_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "note_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          note_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "note_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          description: string
          downloads: number | null
          file_size: string
          file_type: string
          file_url: string
          id: string
          subject_id: string | null
          title: string
          upload_date: string | null
          uploader_id: string
        }
        Insert: {
          description: string
          downloads?: number | null
          file_size: string
          file_type: string
          file_url: string
          id?: string
          subject_id?: string | null
          title: string
          upload_date?: string | null
          uploader_id: string
        }
        Update: {
          description?: string
          downloads?: number | null
          file_size?: string
          file_type?: string
          file_url?: string
          id?: string
          subject_id?: string | null
          title?: string
          upload_date?: string | null
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string | null
          id: string
          note_id: string | null
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_id?: string | null
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note_id?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "note_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          branch: string
          code: string
          id: string
          name: string
          year: string
        }
        Insert: {
          branch: string
          code: string
          id?: string
          name: string
          year: string
        }
        Update: {
          branch?: string
          code?: string
          id?: string
          name?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      note_stats: {
        Row: {
          avg_rating: number | null
          branch: string | null
          comments_count: number | null
          description: string | null
          downloads: number | null
          file_size: string | null
          file_type: string | null
          file_url: string | null
          id: string | null
          likes_count: number | null
          subject_code: string | null
          subject_id: string | null
          subject_name: string | null
          title: string | null
          upload_date: string | null
          uploader_email: string | null
          uploader_id: string | null
          year: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
