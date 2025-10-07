import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    companyName: '',
    cnpj: '',
    managerName: '',
    email: '',
    phone: '',
    employeeCount: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);

    if (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando...'
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(signupData.email, signupData.password, signupData.managerName, {
      companyName: signupData.companyName,
      cnpj: signupData.cnpj,
      phone: signupData.phone,
      employeeCount: signupData.employeeCount
    });

    if (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verifique seu email para confirmar o cadastro.'
      });
      setSignupData({ 
        companyName: '',
        cnpj: '',
        managerName: '',
        email: '',
        phone: '',
        employeeCount: '',
        password: ''
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Lovable Learning</CardTitle>
          <CardDescription className="text-center">
            Plataforma de capacitação profissional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-company">Nome da Empresa</Label>
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Sua Empresa Ltda"
                    value={signupData.companyName}
                    onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-cnpj">CNPJ</Label>
                  <Input
                    id="signup-cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={signupData.cnpj}
                    onChange={(e) => setSignupData({ ...signupData, cnpj: formatCNPJ(e.target.value) })}
                    maxLength={18}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-manager">Nome do Gestor</Label>
                  <Input
                    id="signup-manager"
                    type="text"
                    placeholder="João Silva"
                    value={signupData.managerName}
                    onChange={(e) => setSignupData({ ...signupData, managerName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Celular</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: formatPhone(e.target.value) })}
                    maxLength={15}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-employees">Quantidade de Funcionários</Label>
                  <Input
                    id="signup-employees"
                    type="number"
                    placeholder="50"
                    value={signupData.employeeCount}
                    onChange={(e) => setSignupData({ ...signupData, employeeCount: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Admin? <a href="/admin/login" className="text-primary hover:underline">Clique aqui</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
