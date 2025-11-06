import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditGroupDialogProps {
  trigger?: React.ReactNode;
  group: {
    id_grupo: number;
    nome: string;
    descricao: string;
    max_membros?: number;
  };
}

export const EditGroupDialog = ({ trigger, group }: EditGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: group.nome,
    descricao: group.descricao,
    max_membros: group.max_membros || 50
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('grupo')
        .update({
          nome: formData.nome,
          descricao: formData.descricao,
          max_membros: formData.max_membros
        })
        .eq('id_grupo', group.id_grupo);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Grupo atualizado com sucesso"
      });
      
      setOpen(false);
    } catch (error: any) {
      console.error('Error updating group:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o grupo",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Editar Grupo</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu grupo de apoio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Grupo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Grupo de Apoio à Ansiedade"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o propósito e foco do grupo..."
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_membros">Quantidade Máxima de Participantes</Label>
              <Input
                id="max_membros"
                type="number"
                min="2"
                max="500"
                value={formData.max_membros}
                onChange={(e) => setFormData(prev => ({ ...prev, max_membros: parseInt(e.target.value) || 50 }))}
                placeholder="50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};