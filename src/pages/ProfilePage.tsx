import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Shield, Users, Calendar, MapPin, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = userId === "me" || userId === user?.id;

  const handleEditProfile = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de edição de perfil estará disponível em breve!"
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUserId = isOwnProfile ? user?.id : userId;
        
        if (!targetUserId) return;

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (error) throw error;

        setProfile(profileData);

        // Buscar grupos do usuário
        const { data: memberData, error: memberError } = await supabase
          .from('grupo_membro')
          .select('id_grupo')
          .eq('user_id', targetUserId);

        if (memberError) {
          console.error('Erro ao buscar membros:', memberError);
        } else if (memberData && memberData.length > 0) {
          const groupIds = memberData.map(m => m.id_grupo);
          const { data: groupsData, error: groupsError } = await supabase
            .from('grupo')
            .select('*')
            .in('id_grupo', groupIds);

          if (groupsError) {
            console.error('Erro ao buscar grupos:', groupsError);
          } else {
            setMyGroups(groupsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user, isOwnProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
          <Button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const isPsychologist = profile.tipo_usuario === 'psychologist';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Juntos</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ${
                    isPsychologist ? "verified-badge" : "bg-primary text-primary-foreground"
                  }`}>
                    {isPsychologist ? (
                      <Shield className="h-12 w-12" />
                    ) : (
                      profile.nome.charAt(0)
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{profile.nome}</h1>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {isPsychologist && (
                          <>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              <Shield className="h-3 w-3 mr-1" />
                              Psicólogo Verificado
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    {isOwnProfile && (
                      <Button variant="outline" onClick={handleEditProfile}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Membro desde {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isPsychologist ? "Grupos que Acompanha" : "Grupos Participando"}
              </CardTitle>
              <CardDescription>
                {isPsychologist 
                  ? "Grupos onde oferece suporte profissional"
                  : "Comunidades de apoio que participa"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myGroups.length > 0 ? (
                  myGroups.map((group) => (
                    <div 
                      key={group.id_grupo} 
                      className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                      onClick={() => navigate(`/group/${group.id_grupo}`)}
                    >
                      <span className="font-medium">{group.nome}</span>
                      <Button variant="ghost" size="sm">
                        Ver Grupo
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum grupo ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Sua atividade na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Grupos Participando</span>
                  <span className="font-bold text-lg text-primary">{myGroups.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo de Usuário</span>
                  <span className="font-bold text-lg text-secondary">
                    {isPsychologist ? 'Psicólogo' : 'Usuário'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dias na Plataforma</span>
                  <span className="font-bold text-lg text-warning">
                    {Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;