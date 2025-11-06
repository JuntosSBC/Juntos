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
      console.log('Buscando grupos...');
      const { data, error } = await supabase
        .from('grupo')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar grupos:', error);
        throw error;
      }
      console.log('Grupos encontrados:', data);
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
      console.log('Buscando meus grupos para user:', user.id);
      
      // Primeiro busca os IDs dos grupos que o usuário participa
      const { data: memberData, error: memberError } = await supabase
        .from('grupo_membro')
        .select('id_grupo')
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Erro ao buscar membros:', memberError);
        throw memberError;
      }

      console.log('Membros encontrados:', memberData);

      if (!memberData || memberData.length === 0) {
        console.log('Usuário não participa de nenhum grupo');
        setMyGroups([]);
        return;
      }

      // Busca os detalhes dos grupos
      const groupIds = memberData.map(m => m.id_grupo);
      const { data: groupsData, error: groupsError } = await supabase
        .from('grupo')
        .select('*')
        .in('id_grupo', groupIds);

      if (groupsError) {
        console.error('Erro ao buscar grupos:', groupsError);
        throw groupsError;
      }

      console.log('Meus grupos encontrados:', groupsData);
      setMyGroups(groupsData || []);
    } catch (error) {
      console.error('Error fetching my groups:', error);
    }
  };

  const createGroup = async (groupData: { nome: string; descricao: string; max_membros?: number }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um grupo",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('Criando grupo:', groupData, 'para user:', user.id);
      
      const { data, error } = await supabase
        .from('grupo')
        .insert({
          nome: groupData.nome,
          descricao: groupData.descricao,
          user_id: user.id,
          max_membros: groupData.max_membros || 50
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar grupo:', error);
        throw error;
      }

      console.log('Grupo criado:', data);

      // Join the group as creator
      console.log('Entrando no grupo criado...');
      await joinGroup(data.id_grupo);
      
      toast({
        title: "Sucesso!",
        description: "Grupo criado com sucesso"
      });

      console.log('Atualizando lista de grupos...');
      await Promise.all([fetchGroups(), fetchMyGroups()]);
      
      return data;
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o grupo",
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
      console.log('Entrando no grupo:', groupId, 'user:', user.id);
      
      const { error } = await supabase
        .from('grupo_membro')
        .insert({
          id_grupo: groupId,
          user_id: user.id,
          papel: 'membro'
        });

      if (error) {
        console.error('Erro ao entrar no grupo:', error);
        throw error;
      }

      console.log('Entrou no grupo com sucesso');

      toast({
        title: "Sucesso!",
        description: "Você entrou no grupo!"
      });

      await fetchMyGroups();
      return true;
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        console.log('Usuário já é membro deste grupo');
        toast({
          title: "Aviso",
          description: "Você já é membro deste grupo",
          variant: "destructive"
        });
      } else {
        console.error('Error joining group:', error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível entrar no grupo",
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

    // Set up realtime subscription for grupo table
    const channel = supabase
      .channel('grupo-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grupo'
        },
        (payload) => {
          console.log('Realtime grupo update:', payload);
          if (payload.eventType === 'INSERT') {
            fetchGroups();
            if (user && payload.new.user_id === user.id) {
              fetchMyGroups();
            }
          } else if (payload.eventType === 'UPDATE') {
            fetchGroups();
            fetchMyGroups();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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