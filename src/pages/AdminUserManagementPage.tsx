import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Shield, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

const AdminUserManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(false);

  const [psychologistData, setPsychologistData] = useState({
    name: "",
    email: "",
    password: "",
    crp: "",
    specialty: "",
    bio: ""
  });

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Redirect if not admin
  if (!roleLoading && !isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const handleCreatePsychologist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: psychologistData.email,
        password: psychologistData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome: psychologistData.name,
            tipo_usuario: "psychologist",
            crp: psychologistData.crp,
            especialidade: psychologistData.specialty,
            bio: psychologistData.bio
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add psychologist role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: "psychologist"
          });

        if (roleError) throw roleError;

        toast({
          title: "Psicólogo cadastrado com sucesso!",
          description: `${psychologistData.name} foi adicionado como psicólogo.`
        });

        // Reset form
        setPsychologistData({
          name: "",
          email: "",
          password: "",
          crp: "",
          specialty: "",
          bio: ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar psicólogo",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome: adminData.name,
            tipo_usuario: "comum"
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: "admin"
          });

        if (roleError) throw roleError;

        toast({
          title: "Administrador cadastrado com sucesso!",
          description: `${adminData.name} foi adicionado como administrador.`
        });

        // Reset form
        setAdminData({
          name: "",
          email: "",
          password: ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar administrador",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin-dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Gerenciar Usuários</h1>
            </div>
          </div>
          <Badge variant="secondary">Admin</Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Cadastro de Usuários</h2>
          <p className="text-muted-foreground">
            Adicione novos psicólogos e administradores à plataforma
          </p>
        </div>

        <Tabs defaultValue="psychologist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="psychologist" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Psicólogo
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administrador
            </TabsTrigger>
          </TabsList>

          <TabsContent value="psychologist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-secondary" />
                  Cadastrar Psicólogo
                </CardTitle>
                <CardDescription>
                  Adicione um novo psicólogo verificado à plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePsychologist} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="psy-name">Nome completo *</Label>
                      <Input
                        id="psy-name"
                        placeholder="Dr(a). Nome Sobrenome"
                        required
                        value={psychologistData.name}
                        onChange={(e) => setPsychologistData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="psy-email">Email *</Label>
                      <Input
                        id="psy-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        required
                        value={psychologistData.email}
                        onChange={(e) => setPsychologistData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="psy-password">Senha *</Label>
                      <Input
                        id="psy-password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        value={psychologistData.password}
                        onChange={(e) => setPsychologistData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="psy-crp">Número do CRP *</Label>
                      <Input
                        id="psy-crp"
                        placeholder="Ex: 12/34567"
                        required
                        value={psychologistData.crp}
                        onChange={(e) => setPsychologistData(prev => ({ ...prev, crp: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="psy-specialty">Especialidade *</Label>
                    <Input
                      id="psy-specialty"
                      placeholder="Ex: Psicologia Clínica, Terapia Cognitiva..."
                      required
                      value={psychologistData.specialty}
                      onChange={(e) => setPsychologistData(prev => ({ ...prev, specialty: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="psy-bio">Bio (opcional)</Label>
                    <Textarea
                      id="psy-bio"
                      placeholder="Breve descrição sobre o psicólogo..."
                      rows={3}
                      value={psychologistData.bio}
                      onChange={(e) => setPsychologistData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {loading ? "Cadastrando..." : "Cadastrar Psicólogo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Cadastrar Administrador
                </CardTitle>
                <CardDescription>
                  Adicione um novo administrador à plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdmin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Nome completo *</Label>
                    <Input
                      id="admin-name"
                      placeholder="Nome Sobrenome"
                      required
                      value={adminData.name}
                      onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email *</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      required
                      value={adminData.email}
                      onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha *</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                      value={adminData.password}
                      onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ Atenção: Administradores têm acesso total à plataforma
                    </p>
                  </div>

                  <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {loading ? "Cadastrando..." : "Cadastrar Administrador"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
