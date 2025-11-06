import { useState } from "react";
import { Heart, Plus, Users, Calendar, MessageCircle, Shield, Clock, Settings, LogOut, Search, Filter, BarChart3, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PsychologistDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSettings = () => {
    toast({
      title: "Em desenvolvimento",
      description: "As configurações estarão disponíveis em breve!"
    });
  };

  const myGroups = [
    {
      id: "anxiety",
      name: "Grupo de Ansiedade",
      description: "Apoio para quem convive com ansiedade e seus desafios diários",
      members: 847,
      online: 23,
      category: "Ansiedade",
      color: "bg-primary",
      role: "moderator"
    },
    {
      id: "depression",
      name: "Superando a Depressão",
      description: "Um espaço seguro para compartilhar experiências e encontrar esperança",
      members: 1203,
      online: 41,
      category: "Depressão",
      color: "bg-secondary",
      role: "moderator"
    }
  ];

  const myEvents = [
    {
      id: "1",
      title: "Lidando com Crises de Ansiedade",
      description: "Técnicas práticas para gerenciar momentos de alta ansiedade",
      date: "2024-01-20",
      time: "10:00",
      group: "Ansiedade",
      participants: 35,
      status: "upcoming"
    },
    {
      id: "2",
      title: "Construindo Autoestima Saudável",
      description: "Workshop sobre autoimagem positiva e autocompaixão",
      date: "2024-01-22",
      time: "15:00",
      group: "Depressão",
      participants: 28,
      status: "upcoming"
    },
    {
      id: "3",
      title: "Técnicas de Respiração para Ansiedade",
      description: "Sessão prática de exercícios respiratórios",
      date: "2024-01-15",
      time: "14:00",
      group: "Ansiedade",
      participants: 42,
      status: "completed"
    }
  ];

  const stats = {
    totalParticipants: 89,
    eventsThisMonth: 8,
    averageRating: 4.8,
    groupsModerated: 2
  };

  const filteredEvents = myEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || 
                         (filterCategory === "upcoming" && event.status === "upcoming") ||
                         (filterCategory === "completed" && event.status === "completed");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Juntos</span>
            <Badge variant="secondary" className="ml-2">
              <Shield className="h-3 w-3 mr-1" />
              Psicólogo
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleSettings}>
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
            Painel Profissional 👨‍⚕️
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus grupos, eventos e acompanhe o progresso dos seus pacientes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participantes</p>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eventos Este Mês</p>
                  <p className="text-2xl font-bold">{stats.eventsThisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Grupos Moderados</p>
                  <p className="text-2xl font-bold">{stats.groupsModerated}</p>
                </div>
                <Shield className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os eventos</SelectItem>
              <SelectItem value="upcoming">Próximos</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="events" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Meus Eventos</TabsTrigger>
                <TabsTrigger value="groups">Meus Grupos</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Meus Eventos</h2>
                  <Button variant="trust">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-secondary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant="outline">{event.group}</Badge>
                                <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                                  {event.status === "upcoming" ? "Próximo" : "Concluído"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {event.date} às {event.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {event.participants} participantes
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Editar
                                </Button>
                                {event.status === "upcoming" && (
                                  <Button variant="soft" size="sm">
                                    Iniciar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Grupos Moderados</h2>
                  <Button variant="soft">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Grupo
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {myGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className="card-hover cursor-pointer"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-8 ${group.color} rounded-full`}></div>
                            <div>
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {group.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary">Moderador</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.members} membros
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            {group.online} online agora
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar Relatório
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Participação nos Grupos</CardTitle>
                      <CardDescription>Análise de engajamento dos participantes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Grupo de Ansiedade</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full">
                              <div className="w-20 h-2 bg-primary rounded-full"></div>
                            </div>
                            <span className="text-sm">62%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Superando a Depressão</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full">
                              <div className="w-28 h-2 bg-secondary rounded-full"></div>
                            </div>
                            <span className="text-sm">87%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Avaliações dos Eventos</CardTitle>
                      <CardDescription>Feedback dos participantes sobre seus eventos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                        <div className="text-muted-foreground">Avaliação média</div>
                        <div className="text-sm text-muted-foreground mt-1">Baseado em 156 avaliações</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Button variant="trust" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Evento
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mensagens
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatórios
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Evento concluído</p>
                        <p className="text-xs text-muted-foreground">Técnicas de Respiração • 2h atrás</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-secondary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Novo membro</p>
                        <p className="text-xs text-muted-foreground">Grupo de Ansiedade • 4h atrás</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;