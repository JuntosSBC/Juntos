import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { GroupMessage } from './useGroups';

export const useGroupMessages = (groupId: number) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!groupId) return;

    try {
      // First get the messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('mensagem_grupo')
        .select('*')
        .eq('id_grupo', groupId)
        .order('data_envio', { ascending: true });

      if (messagesError) throw messagesError;

      // Then get the profiles for these messages
      if (messagesData && messagesData.length > 0) {
        const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, nome, tipo_usuario')
          .in('id', userIds);

        // Combine messages with profile data
        const messagesWithProfiles = messagesData.map(message => ({
          ...message,
          profiles: profilesData?.find(profile => profile.id === message.user_id) || null
        }));

        setMessages(messagesWithProfiles);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('mensagem_grupo')
        .insert({
          id_grupo: groupId,
          user_id: user.id,
          conteudo: content.trim(),
          tipo: 'texto'
        });

      if (error) throw error;
      
      // Messages will be updated via real-time subscription
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (!groupId) return;

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('group-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagem_grupo',
          filter: `id_grupo=eq.${groupId}`
        },
        async (payload) => {
          // Get the new message
          const { data: messageData } = await supabase
            .from('mensagem_grupo')
            .select('*')
            .eq('id_mensagem', payload.new.id_mensagem)
            .single();

          if (messageData) {
            // Get the profile for this message
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, nome, tipo_usuario')
              .eq('id', messageData.user_id)
              .single();

            const messageWithProfile = {
              ...messageData,
              profiles: profileData
            };

            setMessages(prev => [...prev, messageWithProfile]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  return {
    messages,
    loading,
    sendMessage,
    refetchMessages: fetchMessages
  };
};