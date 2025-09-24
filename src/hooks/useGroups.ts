import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Group {
  id_grupo: number;
  nome: string;
  descricao: string;
  data_criacao: string;
  user_id: string;
  imagem_capa?: string;
}

export interface GroupMember {
  id_grupo_membro: number;
  id_grupo: number;
  user_id: string;
  data_entrada: string;
  papel: string;
}

export interface GroupMessage {
  id_mensagem: number;
  id_grupo: number;
  user_id: string;
  conteudo: string;
  tipo: string;
  data_envio: string;
  caminho_arquivo?: string;
  id_usuario?: number; // Legacy field from old schema
  profiles?: {
    id: string;
    nome: string;
    tipo_usuario: string;
  } | null;
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('grupo')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os grupos",
        variant: "destructive"
      });
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('grupo_membro')
        .select(`
          *,
          grupo:id_grupo (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const myGroupsData = data?.map(member => member.grupo).filter(Boolean) || [];
      setMyGroups(myGroupsData);
    } catch (error) {
      console.error('Error fetching my groups:', error);
    }
  };

  const createGroup = async (groupData: { nome: string; descricao: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um grupo",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('grupo')
        .insert({
          nome: groupData.nome,
          descricao: groupData.descricao,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Join the group as creator
      await joinGroup(data.id_grupo);
      
      toast({
        title: "Sucesso!",
        description: "Grupo criado com sucesso"
      });

      await fetchGroups();
      await fetchMyGroups();
      
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o grupo",
        variant: "destructive"
      });
      return null;
    }
  };

  const joinGroup = async (groupId: number) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para participar de um grupo",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('grupo_membro')
        .insert({
          id_grupo: groupId,
          user_id: user.id,
          papel: 'membro'
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Você entrou no grupo!"
      });

      await fetchMyGroups();
      return true;
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "Aviso",
          description: "Você já é membro deste grupo",
          variant: "destructive"
        });
      } else {
        console.error('Error joining group:', error);
        toast({
          title: "Erro",
          description: "Não foi possível entrar no grupo",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const leaveGroup = async (groupId: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('grupo_membro')
        .delete()
        .eq('id_grupo', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Você saiu do grupo"
      });

      await fetchMyGroups();
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sair do grupo",
        variant: "destructive"
      });
      return false;
    }
  };

  const isUserInGroup = (groupId: number) => {
    return myGroups.some(group => group.id_grupo === groupId);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGroups(), fetchMyGroups()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    groups,
    myGroups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    isUserInGroup,
    refetchGroups: fetchGroups,
    refetchMyGroups: fetchMyGroups
  };
};