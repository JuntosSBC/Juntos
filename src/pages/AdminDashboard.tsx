import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface PendingPsychologist {
  id: string;
  user_id: string;
  crp: string;
  especialidade: string;
  bio: string;
  verificado: boolean;
  profile: {
    nome: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [psychologists, setPsychologists] = useState<PendingPsychologist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard');
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      });
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingPsychologists();
    }
  }, [isAdmin]);

  const fetchPendingPsychologists = async () => {
    setLoading(true);
    const { data: psychData, error } = await supabase
      .from('psychologists')
      .select('*')
      .eq('verificado', false);

    if (error) {
      console.error('Error fetching psychologists:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os psicólogos pendentes.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (!psychData || psychData.length === 0) {
      setPsychologists([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for these psychologists
    const userIds = psychData.map(p => p.user_id);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, nome, email')
      .in('user_id', userIds);

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
    }

    const psychologistsWithProfiles = psychData.map(psych => ({
      ...psych,
      profile: profileData?.find(p => p.user_id === psych.user_id) || { nome: 'Desconhecido', email: '' }
    }));

    setPsychologists(psychologistsWithProfiles);
    setLoading(false);
  };

  const handleApprove = async (psychologistId: string, userId: string) => {
    const { error: updateError } = await supabase
      .from('psychologists')
      .update({ verificado: true })
      .eq('id', psychologistId);

    if (updateError) {
      console.error('Error approving psychologist:', updateError);
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar o psicólogo.',
        variant: 'destructive',
      });
      return;
    }

    // Add psychologist role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'psychologist' });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('Error adding psychologist role:', roleError);
    }

    toast({
      title: 'Sucesso',
      description: 'Psicólogo aprovado com sucesso!',
    });

    fetchPendingPsychologists();
  };

  const handleReject = async (psychologistId: string) => {
    const { error } = await supabase
      .from('psychologists')
      .delete()
      .eq('id', psychologistId);

    if (error) {
      console.error('Error rejecting psychologist:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível rejeitar o psicólogo.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sucesso',
      description: 'Psicólogo rejeitado.',
    });

    fetchPendingPsychologists();
  };

  if (roleLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/users')}>
                Gerenciar Usuários
              </Button>
              <Badge variant="secondary">Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Psicólogos Pendentes de Aprovação</CardTitle>
            <CardDescription>
              Revise e aprove os psicólogos que solicitaram cadastro na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : psychologists.length === 0 ? (
              <p className="text-muted-foreground">Nenhum psicólogo pendente de aprovação.</p>
            ) : (
              <div className="space-y-4">
                {psychologists.map((psych) => (
                  <Card key={psych.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{psych.profile.nome}</h3>
                          <p className="text-sm text-muted-foreground">{psych.profile.email}</p>
                          <div className="space-y-1">
                            <p className="text-sm"><strong>CRP:</strong> {psych.crp}</p>
                            {psych.especialidade && (
                              <p className="text-sm"><strong>Especialidade:</strong> {psych.especialidade}</p>
                            )}
                            {psych.bio && (
                              <p className="text-sm"><strong>Bio:</strong> {psych.bio}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(psych.id, psych.user_id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(psych.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
