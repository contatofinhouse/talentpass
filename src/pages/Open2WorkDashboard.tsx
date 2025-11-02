import ManagerDashboard from "./ManagerDashboard";

/**
 * Dashboard dedicado para usuários Open2Work (plano B2C R$ 9,80/mês).
 * 
 * Herda todas as funcionalidades do ManagerDashboard, mas:
 * - Oculta a seção "Colaboradores" (métrica + gestão completa)
 * - Mantém acesso total a cursos, favoritos, certificados, e perfil
 */
const Open2WorkDashboard = () => {
  return <ManagerDashboard isOpen2Work />;
};

export default Open2WorkDashboard;
