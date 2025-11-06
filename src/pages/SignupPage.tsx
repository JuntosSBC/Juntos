import { useState } from "react";
import { Heart, ArrowLeft, User, UserCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [psychologistFormData, setPsychologistFormData] = useState({
    name: '',
    email: '',
    password: '',
    crp: '',
    specialty: '',
    bio: ''
  });

  const handleSignup = async (e: React.FormEvent, role: "user" | "psychologist") => {
    e.preventDefault();
    setLoading(true);
    
    const formData = role === "user" ? userFormData : psychologistFormData;
    
    // Validate passwords match for user signup
    if (role === "user" && formData.password !== userFormData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    const userData = {
      nome: formData.name,
      tipo_usuario: role === "user" ? "comum" : "psychologist",
      ...(role === "psychologist" && {
        crp: psychologistFormData.crp,
        especialidade: psychologistFormData.specialty,
        bio: psychologistFormData.bio
      })
    };
    
    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message === "User already registered" 
          ? "Este email já está cadastrado" 
          : "Erro ao criar conta. Tente novamente.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: role === "psychologist" 
          ? "Sua conta será verificada em até 24 horas." 
          : "Bem-vindo à comunidade Juntos!",
      });
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-50 h-10 rounded-lg flex items-center justify-center">
              <img
                src="https://i.imgur.com/m2m29oA.png" 
                alt="Home"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Junte-se à nossa <span className="text-primary">comunidade</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Crie sua conta e comece a fazer parte de uma rede de apoio e cuidado
          </p>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Usuário
            </TabsTrigger>
            <TabsTrigger value="psychologist" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Psicólogo(a)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Cadastro de Usuário
                </CardTitle>
                <CardDescription>
                  Conecte-se com pessoas que compreendem seus desafios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSignup(e, "user")} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome" 
                      required 
                      value={userFormData.name}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      required 
                      value={userFormData.email}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Mínimo 8 caracteres" 
                      required 
                      value={userFormData.password}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar senha</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirme sua senha" 
                      required 
                      value={userFormData.confirmPassword}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psychologist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-secondary" />
                  Cadastro de Psicólogo(a)
                </CardTitle>
                <CardDescription>
                  Ofereça suporte profissional e conduza encontros para a comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSignup(e, "psychologist")} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="psy-name">Nome completo</Label>
                    <Input 
                      id="psy-name" 
                      placeholder="Dr(a). Seu nome" 
                      required 
                      value={psychologistFormData.name}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="psy-email">Email</Label>
                    <Input 
                      id="psy-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      required 
                      value={psychologistFormData.email}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="psy-password">Senha</Label>
                    <Input 
                      id="psy-password" 
                      type="password" 
                      placeholder="Mínimo 8 caracteres" 
                      required 
                      value={psychologistFormData.password}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crp">Número do CRP</Label>
                    <Input 
                      id="crp" 
                      placeholder="Ex: 12/34567" 
                      required 
                      value={psychologistFormData.crp}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, crp: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input 
                      id="specialty" 
                      placeholder="Ex: Psicologia Clínica, Terapia Cognitiva..." 
                      required 
                      value={psychologistFormData.specialty}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, specialty: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Sobre você (opcional)</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Conte um pouco sobre sua experiência e abordagem terapêutica..."
                      rows={3}
                      value={psychologistFormData.bio}
                      onChange={(e) => setPsychologistFormData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="document">Documento de Registro (CRP)</Label>
                    <div className="flex items-center gap-2 p-4 border border-dashed border-border rounded-md hover:border-primary transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Faça upload do seu documento CRP (PDF, JPG ou PNG)
                      </span>
                    </div>
                  </div>

                  <div className="bg-secondary-soft p-4 rounded-md">
                    <p className="text-sm text-secondary font-medium">
                      ⚡ Verificação rápida: Sua conta será analisada em até 24 horas.
                    </p>
                  </div>

                  <Button type="submit" variant="trust" className="w-full" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta Profissional"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Já tem uma conta?{" "}
            <Button variant="link" onClick={() => navigate("/login")} className="p-0">
              Faça login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;