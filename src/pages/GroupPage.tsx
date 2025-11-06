import { useState, useRef, useEffect } from "react";
import { Heart, ArrowLeft, Users, Send, Shield, Settings, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { useGroupMessages } from "@/hooks/useGroupMessages";


const GroupPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { groups, joinGroup, isUserInGroup } = useGroups();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const groupIdNumber = groupId ? parseInt(groupId) : 0;
  const { messages, loading: messagesLoading, sendMessage } = useGroupMessages(groupIdNumber);
  
  const group = groups.find(g => g.id_grupo === groupIdNumber);
  const isJoined = isUserInGroup(groupIdNumber);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinGroup = async () => {
    if (groupIdNumber) {
      await joinGroup(groupIdNumber);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">{group.nome}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Grupo de apoio
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/group/${groupId}/info`)}>
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile/me')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Group Info */}
      {!isJoined && (
        <div className="border-b bg-accent-soft">
          <div className="container mx-auto px-4 py-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {group.nome}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {group.descricao}
                    </CardDescription>
                  </div>
                  <Button variant="hero" onClick={handleJoinGroup}>
                    <Plus className="h-4 w-4 mr-2" />
                    Participar do Grupo
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {isJoined ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="container mx-auto max-w-4xl">
                {messagesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Carregando mensagens...</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isMyMessage = message.user_id === user?.id;
                      const isVerified = message.profiles?.tipo_usuario === 'psychologist';
                      const userName = isMyMessage ? 'Você' : message.profiles?.nome || 'Usuário';
                      
                      return (
                        <div key={message.id_mensagem} className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isVerified ? "verified-badge" : "bg-muted"
                          }`}>
                            {isVerified ? (
                              <Shield className="h-4 w-4" />
                            ) : (
                              userName.charAt(0)
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-medium text-sm">{userName}</span>
                              {isVerified && (
                                <Badge variant="secondary" className="text-xs">Psicólogo Verificado</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.data_envio).toLocaleTimeString("pt-BR", { 
                                  hour: "2-digit", 
                                  minute: "2-digit" 
                                })}
                              </span>
                            </div>
                            <div className={`rounded-lg p-3 ${
                              isMyMessage 
                                ? "bg-primary text-primary-foreground ml-8" 
                                : "bg-card"
                            }`}>
                              <p className="text-sm">{message.conteudo}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t bg-card/50 p-4">
              <div className="container mx-auto max-w-4xl">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                  />
                  <Button type="submit" variant="hero" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Participe da Conversa</h2>
              <p className="text-muted-foreground mb-6">
                Conecte-se com pessoas que passam pelos mesmos desafios e receba apoio em um ambiente seguro.
              </p>
              <Button variant="hero" onClick={handleJoinGroup} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Participar do Grupo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;