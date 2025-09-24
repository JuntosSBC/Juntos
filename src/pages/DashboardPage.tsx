import { useState, useEffect } from "react";
import { Heart, Plus, Users, Calendar, MessageCircle, Shield, Clock, Settings, LogOut, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { groups, myGroups, loading, joinGroup, isUserInGroup } = useGroups();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [userProfile, setUserProfile] = useState(null);

  const upcomingEvents = [
    {
      id: "1",
      title: "Lidando com Crises de Ansiedade",
      description: "Técnicas práticas para gerenciar momentos de alta ansiedade",
      date: "2024-01-20",
      time: "10:00",
      psychologist: "Dr. Maria Silva",
      crp: "CRP 12345",
      group: "Ansiedade",
      participants: 35
    },
    {
      id: "2",
      title: "Construindo Autoestima Saudável",
      description: "Workshop sobre autoimagem positiva e autocompaixão",
      date: "2024-01-22",
      time: "15:00",
      psychologist: "Dr. João Santos",
      crp: "CRP 67890",
      group: "Depressão",
      participants: 28
    }
  ];

  // Filter functions
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleJoinGroup = async (groupId: number) => {
    await joinGroup(groupId);
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Juntos</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {userProfile?.nome || 'Usuário'}! Bem-vindo de volta 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui você pode se conectar com grupos de apoio e participar de encontros com psicólogos verificados
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar grupos ou eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <CreateGroupDialog 
              trigger={
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Grupo
                </Button>
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Support Groups */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Grupos de Apoio</h2>
                <CreateGroupDialog />
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando grupos...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredGroups.map((group) => (
                    <Card 
                      key={group.id_grupo} 
                      className="card-hover cursor-pointer"
                      onClick={() => navigate(`/group/${group.id_grupo}`)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-8 bg-primary rounded-full"></div>
                            <div>
                              <CardTitle className="text-lg">{group.nome}</CardTitle>
                              <CardDescription className="mt-1">
                                {group.descricao}
                              </CardDescription>
                            </div>
                          </div>
                          {isUserInGroup(group.id_grupo) && (
                            <Badge variant="secondary">Participando</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Membros do grupo
                          </div>
                          {!isUserInGroup(group.id_grupo) && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinGroup(group.id_grupo);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Participar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredGroups.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum grupo encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* My Groups */}
            {myGroups.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Meus Grupos</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {myGroups.map((group) => (
                    <Card 
                      key={group.id_grupo} 
                      className="card-hover cursor-pointer"
                      onClick={() => navigate(`/group/${group.id_grupo}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-6 bg-primary rounded-full"></div>
                          <CardTitle className="text-base">{group.nome}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm">
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Conversar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}

            <section>
              <h3 className="text-lg font-semibold mb-4">Sua Atividade</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary-soft rounded-lg">
                  <span className="text-sm font-medium">Grupos Participando</span>
                  <span className="text-lg font-bold text-primary">{myGroups.length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;