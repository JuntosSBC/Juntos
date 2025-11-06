import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Users, Calendar, Shield, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { supabase } from "@/integrations/supabase/client";
import { EditGroupDialog } from "@/components/EditGroupDialog";

const GroupInfoPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { user } = useAuth();
  const { groups } = useGroups();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const groupIdNumber = groupId ? parseInt(groupId) : 0;
  const group = groups.find(g => g.id_grupo === groupIdNumber);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupIdNumber) return;

      try {
        setLoading(true);
        console.log('Buscando membros do grupo:', groupIdNumber);
        
        const { data: memberData, error: memberError } = await supabase
          .from('grupo_membro')
          .select('*')
          .eq('id_grupo', groupIdNumber);

        if (memberError) {
          console.error('Erro ao buscar membros:', memberError);
          throw memberError;
        }

        console.log('Membros raw:', memberData);

        if (!memberData || memberData.length === 0) {
          setMembers([]);
          return;
        }

        // Buscar perfis dos membros
        const userIds = memberData.map(m => m.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', userIds);

        if (profilesError) {
          console.error('Erro ao buscar perfis:', profilesError);
          throw profilesError;
        }

        console.log('Perfis encontrados:', profilesData);

        // Combinar dados
        const membersWithProfiles = memberData.map(member => ({
          ...member,
          profiles: profilesData?.find(p => p.user_id === member.user_id)
        }));

        console.log('Membros com perfis:', membersWithProfiles);
        setMembers(membersWithProfiles);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupIdNumber]);

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Grupo não encontrado</h1>
          <Button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const isCreator = group.user_id === user?.id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/group/${groupId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Informações do Grupo</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Group Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{group.nome}</CardTitle>
                <CardDescription>{group.descricao}</CardDescription>
              </div>
              {isCreator && (
                <EditGroupDialog 
                  group={group}
                  trigger={
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Grupo
                    </Button>
                  }
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Criado em {new Date(group.data_criacao).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {members.length} {members.length === 1 ? 'membro' : 'membros'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Membros do Grupo</CardTitle>
            <CardDescription>
              Pessoas que participam deste grupo de apoio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando membros...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => {
                  const isPsychologist = member.profiles?.tipo_usuario === 'psychologist';
                  const isAdmin = member.papel === 'admin';
                  
                  return (
                    <div key={member.id_grupo_membro} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isPsychologist ? "verified-badge" : "bg-primary text-primary-foreground"
                        }`}>
                          {isPsychologist ? (
                            <Shield className="h-5 w-5" />
                          ) : (
                            <span className="font-bold">
                              {member.profiles?.nome?.charAt(0) || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{member.profiles?.nome || 'Usuário'}</p>
                          <div className="flex gap-2 mt-1">
                            {isPsychologist && (
                              <Badge variant="secondary" className="text-xs">
                                Psicólogo Verificado
                              </Badge>
                            )}
                            {isAdmin && (
                              <Badge variant="outline" className="text-xs">
                                Administrador
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Desde {new Date(member.data_entrada).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  );
                })}
                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum membro ainda</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupInfoPage;
