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
      delivery_info: {
        Row: {
          actual_delivery: string | null
          created_at: string | null
          delivered_at: string | null
          delivered_by: string | null
          delivery_staff: string | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_id: string
          picked_up_at: string | null
          picked_up_by: string | null
          recipient_name: string | null
          tracking_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_staff?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id: string
          picked_up_at?: string | null
          picked_up_by?: string | null
          recipient_name?: string | null
          tracking_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_staff?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          picked_up_at?: string | null
          picked_up_by?: string | null
          recipient_name?: string | null
          tracking_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_info_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_history: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          order_id: string
          status: string
          timestamp: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: string
          timestamp?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: string
          timestamp?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          order_number: string
          payment_method: string
          payment_status: string
          payment_transaction_id: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          order_number: string
          payment_method: string
          payment_status: string
          payment_transaction_id?: string | null
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          order_number?: string
          payment_method?: string
          payment_status?: string
          payment_transaction_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      print_jobs: {
        Row: {
          content: string
          created_at: string
          error: string | null
          id: string
          printer_id: string
          processed_at: string | null
          related_id: string | null
          requested_by: string | null
          status: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          error?: string | null
          id?: string
          printer_id: string
          processed_at?: string | null
          related_id?: string | null
          requested_by?: string | null
          status?: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          error?: string | null
          id?: string
          printer_id?: string
          processed_at?: string | null
          related_id?: string | null
          requested_by?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          display_order: number
          id: string
          is_main: boolean
          product_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_main?: boolean
          product_id: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_main?: boolean
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          added_by: string | null
          barcode: string
          brand: string | null
          category: string
          color: string | null
          condition: Database["public"]["Enums"]["product_condition"]
          date_added: string
          description: string | null
          featured: boolean
          id: string
          inventory_tracking: Json | null
          last_updated: string
          measurements: Json | null
          name: string
          original_price: number | null
          price: number
          size: string | null
          status: string
          sub_category: string | null
          tags: string[] | null
        }
        Insert: {
          added_by?: string | null
          barcode: string
          brand?: string | null
          category: string
          color?: string | null
          condition: Database["public"]["Enums"]["product_condition"]
          date_added?: string
          description?: string | null
          featured?: boolean
          id?: string
          inventory_tracking?: Json | null
          last_updated?: string
          measurements?: Json | null
          name: string
          original_price?: number | null
          price: number
          size?: string | null
          status?: string
          sub_category?: string | null
          tags?: string[] | null
        }
        Update: {
          added_by?: string | null
          barcode?: string
          brand?: string | null
          category?: string
          color?: string | null
          condition?: Database["public"]["Enums"]["product_condition"]
          date_added?: string
          description?: string | null
          featured?: boolean
          id?: string
          inventory_tracking?: Json | null
          last_updated?: string
          measurements?: Json | null
          name?: string
          original_price?: number | null
          price?: number
          size?: string | null
          status?: string
          sub_category?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_book: Json[] | null
          created_at: string | null
          email_preferences: Json | null
          id: string
          loyalty_points: number | null
          name: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          address_book?: Json[] | null
          created_at?: string | null
          email_preferences?: Json | null
          id: string
          loyalty_points?: number | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          address_book?: Json[] | null
          created_at?: string | null
          email_preferences?: Json | null
          id?: string
          loyalty_points?: number | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_history: {
        Row: {
          barcode: string
          created_at: string | null
          device_info: string | null
          id: string
          location: string | null
          scan_result: string | null
          scan_time: string
          scan_type: string
          scanned_by: string | null
        }
        Insert: {
          barcode: string
          created_at?: string | null
          device_info?: string | null
          id?: string
          location?: string | null
          scan_result?: string | null
          scan_time?: string
          scan_type: string
          scanned_by?: string | null
        }
        Update: {
          barcode?: string
          created_at?: string | null
          device_info?: string | null
          id?: string
          location?: string | null
          scan_result?: string | null
          scan_time?: string
          scan_type?: string
          scanned_by?: string | null
        }
        Relationships: []
      }
      shipping_info: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          order_id: string
          phone: string
          postal_code: string
          shipping_method: string
          special_instructions: string | null
          state: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          order_id: string
          phone: string
          postal_code: string
          shipping_method: string
          special_instructions?: string | null
          state: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          order_id?: string
          phone?: string
          postal_code?: string
          shipping_method?: string
          special_instructions?: string | null
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_info_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { required_role: string }
        Returns: boolean
      }
    }
    Enums: {
      product_condition: "new" | "likeNew" | "good" | "fair"
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
      product_condition: ["new", "likeNew", "good", "fair"],
    },
  },
} as const
