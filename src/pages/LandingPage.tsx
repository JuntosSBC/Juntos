import { Users, Shield, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
     {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
         <div className="w-50 h-10 rounded-lg flex items-center justify-center">
              <img
                src="https://i.imgur.com/m2m29oA.png" // Coloque o caminho da sua imagem aqui
                alt="Home"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md text-foreground hover:bg-accent transition"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Participar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-card/80 rounded-full px-4 py-2 text-sm font-medium">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Campanha Setembro Amarelo - Prevenção ao Suicídio
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Você <span className="text-yellow-500">não está sozinho</span>
            <br />
            Juntos, somos <span className="text-yellow-500">mais fortes</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Conecte-se com grupos de apoio, converse com pessoas que entendem suas lutas 
            e tenha acesso a psicólogos verificados. Um espaço seguro criado especialmente para você.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/signup")}
              className="glow-effect"
            >
              Participar Agora
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="trust" 
              size="xl"
              onClick={() => navigate("/login")}
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Um espaço de <span className="text-yellow-500">cuidado</span> e <span className="text-yellow-500">conexão</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos suporte especializado e uma comunidade acolhedora para sua jornada de bem-estar mental
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-hover border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Grupos de Apoio</CardTitle>
                <CardDescription>
                  Conecte-se com pessoas que passam por situações similares em grupos especializados 
                  para depressão, ansiedade e burnout.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-secondary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-soft rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Conversas em Tempo Real</CardTitle>
                <CardDescription>
                  Participe de conversas significativas com pessoas que compreendem seus desafios 
                  em um ambiente seguro e acolhedor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-soft rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Psicólogos Verificados</CardTitle>
                <CardDescription>
                  Acesse palestras e encontros conduzidos por profissionais licenciados.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 px-4 trust-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Eventos e <span className="text-yellow-500">Encontros</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Participe de encontros e palestras ministradas por psicólogos especialistas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-secondary">20 de Setembro, 10h</span>
                </div>
                <CardTitle>Lidando com a Depressão</CardTitle>
                <CardDescription>
                  Encontro sobre estratégias práticas para lidar com sintomas depressivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">Dr. Maria Silva - CRP 12345</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-secondary">25 de Setembro, 15h</span>
                </div>
                <CardTitle>Ansiedade no Trabalho</CardTitle>
                <CardDescription>
                  Workshop sobre como gerenciar ansiedade e estresse no ambiente profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">Dr. João Santos - CRP 67890</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Pronto para começar sua jornada de <span className="text-yellow-500">bem-estar?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a nossa comunidade de apoio e comece a construir conexões 
            significativas hoje mesmo.
          </p>
          <Button 
            variant="hero" 
            size="xl"
            onClick={() => navigate("/signup")}
            className="glow-effect"
          >
            Participar Agora - É Gratuito
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
                src="https://i.imgur.com/m2m29oA.png" // Coloque o caminho da sua imagem aqui
                alt="Home"
                className="w-30 h-10 object-cover rounded-lg"
              />
          </div>
          <p className="text-muted-foreground mb-4">
            Uma plataforma segura para conexão e apoio em saúde mental
          </p>
          <p className="text-muted-foreground mb-4">
            Criada por alunos do Camp SBC
          </p>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
