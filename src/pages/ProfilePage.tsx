import { Heart, ArrowLeft, Shield, Users, Calendar, MapPin, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // Mock user data - in real app, fetch based on userId
  const isOwnProfile = userId === "me";
  const isPsychologist = userId === "psychologist";

  const userData = {
    name: isPsychologist ? "Dr. Maria Silva" : "João Santos",
    email: isPsychologist ? "maria.silva@email.com" : "joao.santos@email.com",
    role: isPsychologist ? "psychologist" : "user",
    crp: isPsychologist ? "CRP 12/34567" : undefined,
    specialty: isPsychologist ? "Psicologia Clínica, Terapia Cognitivo-Comportamental" : undefined,
    bio: isPsychologist 
      ? "Psicóloga especialista em transtornos de ansiedade e depressão. Atuo há 8 anos oferecendo suporte e técnicas terapêuticas baseadas em evidências científicas."
      : "Membro da comunidade em busca de apoio e conexões significativas para lidar com ansiedade.",
    joinedDate: "2023-05-15",
    location: "São Paulo, SP",
    groups: isPsychologist 
      ? ["Grupo de Ansiedade", "Superando a Depressão", "Burnout e Estresse"]
      : ["Grupo de Ansiedade", "Superando a Depressão"],
    upcomingEvents: isPsychologist ? [
      {
        id: "1",
        title: "Lidando com Crises de Ansiedade",
        date: "2024-01-20",
        time: "10:00",
        participants: 35
      },
      {
        id: "2", 
        title: "Workshop: Técnicas de Relaxamento",
        date: "2024-01-25",
        time: "14:00",
        participants: 28
      }
    ] : []
  };

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
                      userData.name.charAt(0)
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {isPsychologist && (
                          <>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              <Shield className="h-3 w-3 mr-1" />
                              Psicólogo Verificado
                            </Badge>
                            <Badge variant="outline">{userData.crp}</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    {isOwnProfile && (
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {userData.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Membro desde {new Date(userData.joinedDate).toLocaleDateString("pt-BR")}
                    </div>
                  </div>

                  {/* Bio */}
                  {userData.bio && (
                    <div className="mt-4">
                      <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
                    </div>
                  )}

                  {/* Specialty (for psychologists) */}
                  {isPsychologist && userData.specialty && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Especialidades</h3>
                      <p className="text-sm text-muted-foreground">{userData.specialty}</p>
                    </div>
                  )}
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
                {userData.groups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{group}</span>
                    <Button variant="ghost" size="sm">
                      Ver Grupo
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events (for psychologists) */}
          {isPsychologist && userData.upcomingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
                <CardDescription>
                  Encontros e palestras que você irá conduzir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{event.title}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("pt-BR")} às {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {event.participants} participantes confirmados
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                  <span className="font-bold text-lg text-primary">{userData.groups.length}</span>
                </div>
                {isPsychologist && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Eventos Este Mês</span>
                      <span className="font-bold text-lg text-secondary">{userData.upcomingEvents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pessoas Ajudadas</span>
                      <span className="font-bold text-lg text-success">156</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dias na Plataforma</span>
                  <span className="font-bold text-lg text-warning">
                    {Math.floor((new Date().getTime() - new Date(userData.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
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