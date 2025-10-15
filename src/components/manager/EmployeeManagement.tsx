import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  onRefresh: () => Promise<void>;
}

export const EmployeeManagement = ({ employees, onRefresh }: EmployeeManagementProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async () => {
    if (!employeeName || !employeeEmail) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Chamar edge function para enviar convite
      const { data, error } = await supabase.functions.invoke("invite-employee", {
        body: {
          email: employeeEmail,
          name: employeeName,
          manager_id: user.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: "Um e-mail de convite foi enviado para o colaborador",
      });

      setIsAddDialogOpen(false);
      setEmployeeName("");
      setEmployeeEmail("");
      await onRefresh();
    } catch (error: any) {
      console.error("Erro ao enviar convite:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar convite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Tem certeza que deseja excluir este colaborador?")) {
      return;
    }

    setLoading(true);

    try {
      // 1. Obter o ID do manager atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // 2. Deletar o vínculo na tabela employees (isso não deleta o usuário)
      const { error: employeeError } = await supabase
        .from("employees")
        .delete()
        .eq("manager_id", user.id)
        .eq("employee_id", employeeId);

      if (employeeError) throw employeeError;

      // 3. Deletar a role de employee
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", employeeId)
        .eq("role", "employee");

      if (roleError) throw roleError;

      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso",
      });

      await onRefresh();
    } catch (error: any) {
      console.error("Erro ao remover colaborador:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover colaborador",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Colaboradores</CardTitle>
            <CardDescription>Gerencie os colaboradores da sua empresa</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Colaborador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Colaborador</DialogTitle>
                <DialogDescription>
                  Insira os dados do novo colaborador
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-name">Nome</Label>
                  <Input
                    id="employee-name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Nome do colaborador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-email">E-mail</Label>
                  <Input
                    id="employee-email"
                    type="email"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="email@empresa.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEmployeeName("");
                    setEmployeeEmail("");
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddEmployee} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">Nenhum colaborador cadastrado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Adicionar Colaborador" para começar
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {new Date(employee.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
