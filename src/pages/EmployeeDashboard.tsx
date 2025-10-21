import service_key from "./ManagerDashboard";

/**
 * O EmployeeDashboard herda todo o comportamento do ManagerDashboard,
 * mas com a flag `isEmployee` ativada, o que faz com que:
 * - os cards e seções de colaboradores sejam ocultos;
 * - o botão "Ativar Plano" não apareça;
 * - a navegação continue igual, mas com acesso restrito.
 */
const EmployeeDashboard = () => {
  return <ManagerDashboard isEmployee />;
};

export default EmployeeDashboard;
