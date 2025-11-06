export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      adm: {
        Row: {
          id_adm: number
          id_usuario: number | null
          nivel_acesso: string | null
        }
        Insert: {
          id_adm?: number
          id_usuario?: number | null
          nivel_acesso?: string | null
        }
        Update: {
          id_adm?: number
          id_usuario?: number | null
          nivel_acesso?: string | null
        }
        Relationships: []
      }
      artigo: {
        Row: {
          conteudo: string
          data_publicacao: string | null
          id_adm: number | null
          id_artigo: number
          imagem_capa: string | null
          status: string | null
          titulo: string
        }
        Insert: {
          conteudo: string
          data_publicacao?: string | null
          id_adm?: number | null
          id_artigo?: number
          imagem_capa?: string | null
          status?: string | null
          titulo: string
        }
        Update: {
          conteudo?: string
          data_publicacao?: string | null
          id_adm?: number | null
          id_artigo?: number
          imagem_capa?: string | null
          status?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "artigo_id_adm_fkey"
            columns: ["id_adm"]
            isOneToOne: false
            referencedRelation: "adm"
            referencedColumns: ["id_adm"]
          },
        ]
      }
      comentario_artigo: {
        Row: {
          conteudo: string
          data_comentario: string | null
          id_artigo: number | null
          id_comentario: number
          id_usuario: number | null
        }
        Insert: {
          conteudo: string
          data_comentario?: string | null
          id_artigo?: number | null
          id_comentario?: number
          id_usuario?: number | null
        }
        Update: {
          conteudo?: string
          data_comentario?: string | null
          id_artigo?: number | null
          id_comentario?: number
          id_usuario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comentario_artigo_id_artigo_fkey"
            columns: ["id_artigo"]
            isOneToOne: false
            referencedRelation: "artigo"
            referencedColumns: ["id_artigo"]
          },
        ]
      }
      comentario_projeto: {
        Row: {
          conteudo: string
          data_comentario: string | null
          id_comentario: number
          id_projeto: number | null
          id_usuario: number | null
        }
        Insert: {
          conteudo: string
          data_comentario?: string | null
          id_comentario?: number
          id_projeto?: number | null
          id_usuario?: number | null
        }
        Update: {
          conteudo?: string
          data_comentario?: string | null
          id_comentario?: number
          id_projeto?: number | null
          id_usuario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comentario_projeto_id_projeto_fkey"
            columns: ["id_projeto"]
            isOneToOne: false
            referencedRelation: "projeto"
            referencedColumns: ["id_projeto"]
          },
        ]
      }
      evento_grupo: {
        Row: {
          data_evento: string
          descricao: string | null
          id_evento: number
          id_grupo: number | null
          id_psicologo: number | null
          link_reuniao: string | null
          titulo: string
        }
        Insert: {
          data_evento: string
          descricao?: string | null
          id_evento?: number
          id_grupo?: number | null
          id_psicologo?: number | null
          link_reuniao?: string | null
          titulo: string
        }
        Update: {
          data_evento?: string
          descricao?: string | null
          id_evento?: number
          id_grupo?: number | null
          id_psicologo?: number | null
          link_reuniao?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_grupo_id_grupo_fkey"
            columns: ["id_grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id_grupo"]
          },
          {
            foreignKeyName: "evento_grupo_id_psicologo_fkey"
            columns: ["id_psicologo"]
            isOneToOne: false
            referencedRelation: "psicologo"
            referencedColumns: ["id_psicologo"]
          },
        ]
      }
      foto_projeto: {
        Row: {
          caminho_arquivo: string
          data_upload: string | null
          descricao: string | null
          id_foto: number
          id_projeto: number | null
        }
        Insert: {
          caminho_arquivo: string
          data_upload?: string | null
          descricao?: string | null
          id_foto?: number
          id_projeto?: number | null
        }
        Update: {
          caminho_arquivo?: string
          data_upload?: string | null
          descricao?: string | null
          id_foto?: number
          id_projeto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "foto_projeto_id_projeto_fkey"
            columns: ["id_projeto"]
            isOneToOne: false
            referencedRelation: "projeto"
            referencedColumns: ["id_projeto"]
          },
        ]
      }
      grupo: {
        Row: {
          criado_por: number | null
          data_criacao: string | null
          descricao: string | null
          id_grupo: number
          imagem_capa: string | null
          max_membros: number
          nome: string
          user_id: string | null
        }
        Insert: {
          criado_por?: number | null
          data_criacao?: string | null
          descricao?: string | null
          id_grupo?: number
          imagem_capa?: string | null
          max_membros?: number
          nome: string
          user_id?: string | null
        }
        Update: {
          criado_por?: number | null
          data_criacao?: string | null
          descricao?: string | null
          id_grupo?: number
          imagem_capa?: string | null
          max_membros?: number
          nome?: string
          user_id?: string | null
        }
        Relationships: []
      }
      grupo_membro: {
        Row: {
          data_entrada: string | null
          id_grupo: number | null
          id_grupo_membro: number
          id_usuario: number | null
          papel: string | null
          user_id: string | null
        }
        Insert: {
          data_entrada?: string | null
          id_grupo?: number | null
          id_grupo_membro?: number
          id_usuario?: number | null
          papel?: string | null
          user_id?: string | null
        }
        Update: {
          data_entrada?: string | null
          id_grupo?: number | null
          id_grupo_membro?: number
          id_usuario?: number | null
          papel?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grupo_membro_id_grupo_fkey"
            columns: ["id_grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id_grupo"]
          },
        ]
      }
      mensagem_grupo: {
        Row: {
          caminho_arquivo: string | null
          conteudo: string
          data_envio: string | null
          id_grupo: number | null
          id_mensagem: number
          id_usuario: number | null
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          caminho_arquivo?: string | null
          conteudo: string
          data_envio?: string | null
          id_grupo?: number | null
          id_mensagem?: number
          id_usuario?: number | null
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          caminho_arquivo?: string | null
          conteudo?: string
          data_envio?: string | null
          id_grupo?: number | null
          id_mensagem?: number
          id_usuario?: number | null
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagem_grupo_id_grupo_fkey"
            columns: ["id_grupo"]
            isOneToOne: false
            referencedRelation: "grupo"
            referencedColumns: ["id_grupo"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          tipo_usuario: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome: string
          tipo_usuario: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          tipo_usuario?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      projeto: {
        Row: {
          data_criacao: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string
          id_adm: number | null
          id_projeto: number
          imagem_capa: string | null
          titulo: string
        }
        Insert: {
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao: string
          id_adm?: number | null
          id_projeto?: number
          imagem_capa?: string | null
          titulo: string
        }
        Update: {
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string
          id_adm?: number | null
          id_projeto?: number
          imagem_capa?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "projeto_id_adm_fkey"
            columns: ["id_adm"]
            isOneToOne: false
            referencedRelation: "adm"
            referencedColumns: ["id_adm"]
          },
        ]
      }
      psicologo: {
        Row: {
          bio: string | null
          crp: string
          especialidade: string | null
          id_psicologo: number
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          crp: string
          especialidade?: string | null
          id_psicologo?: number
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          crp?: string
          especialidade?: string | null
          id_psicologo?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psicologo_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologists: {
        Row: {
          bio: string | null
          created_at: string
          crp: string | null
          especialidade: string | null
          id: string
          updated_at: string
          user_id: string
          verificado: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          crp?: string | null
          especialidade?: string | null
          id?: string
          updated_at?: string
          user_id: string
          verificado?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          crp?: string | null
          especialidade?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          verificado?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      setup_test_admin: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user" | "psychologist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "psychologist"],
    },
  },
} as const
