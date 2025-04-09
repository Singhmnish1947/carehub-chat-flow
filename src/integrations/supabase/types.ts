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
      followups: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          reason: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "followups_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          batch_number: string | null
          category: string
          created_at: string | null
          created_by: string | null
          current_stock: number
          description: string | null
          expiry_date: string | null
          id: string
          location: string | null
          manufacturer: string | null
          minimum_stock: number | null
          name: string
          price: number | null
          supplier: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          current_stock?: number
          description?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          minimum_stock?: number | null
          name: string
          price?: number | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          current_stock?: number
          description?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          minimum_stock?: number | null
          name?: string
          price?: number | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          item_id: string | null
          notes: string | null
          quantity: number
          reference_number: string | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          quantity: number
          reference_number?: string | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          quantity?: number
          reference_number?: string | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_journey: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["patient_status"]
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          started_at?: string | null
          status: Database["public"]["Enums"]["patient_status"]
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["patient_status"]
        }
        Relationships: [
          {
            foreignKeyName: "patient_journey_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_journey_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          aadhar_number: string | null
          address: string | null
          allergies: string[] | null
          blood_group: string | null
          city: string | null
          created_at: string | null
          current_status: Database["public"]["Enums"]["patient_status"] | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          gender: string | null
          id: string
          last_visit: string | null
          medical_history: string[] | null
          name: string
          patient_type: Database["public"]["Enums"]["patient_type"] | null
          phone: string | null
          pincode: string | null
          registration_date: string | null
          reward_points: number | null
          state: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          allergies?: string[] | null
          blood_group?: string | null
          city?: string | null
          created_at?: string | null
          current_status?: Database["public"]["Enums"]["patient_status"] | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          medical_history?: string[] | null
          name: string
          patient_type?: Database["public"]["Enums"]["patient_type"] | null
          phone?: string | null
          pincode?: string | null
          registration_date?: string | null
          reward_points?: number | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          allergies?: string[] | null
          blood_group?: string | null
          city?: string | null
          created_at?: string | null
          current_status?: Database["public"]["Enums"]["patient_status"] | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          gender?: string | null
          id?: string
          last_visit?: string | null
          medical_history?: string[] | null
          name?: string
          patient_type?: Database["public"]["Enums"]["patient_type"] | null
          phone?: string | null
          pincode?: string | null
          registration_date?: string | null
          reward_points?: number | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_items: {
        Row: {
          created_at: string | null
          dosage: string | null
          duration: string | null
          frequency: string | null
          id: string
          instructions: string | null
          medication: string
          prescription_id: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication: string
          prescription_id?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          medication?: string
          prescription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          id: string
          is_digital: boolean | null
          notes: string | null
          patient_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          is_digital?: boolean | null
          notes?: string | null
          patient_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          id?: string
          is_digital?: boolean | null
          notes?: string | null
          patient_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reward_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          patient_id: string | null
          points: number
          reason: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id?: string | null
          points: number
          reason?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          patient_id?: string | null
          points?: number
          reason?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      patient_status:
        | "Registration"
        | "Triage"
        | "Waiting"
        | "InConsultation"
        | "UnderTreatment"
        | "Medication"
        | "Labs"
        | "Admitted"
        | "Discharged"
        | "FollowUp"
      patient_type: "OPD" | "IPD" | "Emergency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      patient_status: [
        "Registration",
        "Triage",
        "Waiting",
        "InConsultation",
        "UnderTreatment",
        "Medication",
        "Labs",
        "Admitted",
        "Discharged",
        "FollowUp",
      ],
      patient_type: ["OPD", "IPD", "Emergency"],
    },
  },
} as const
