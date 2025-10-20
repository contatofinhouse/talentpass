import LegalPageLayout from "@/components/LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Política de Privacidade" lastUpdated="17 de outubro de 2025">
      {/* 1. Introdução */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Introdução</h2>
        <p className="mb-4">
          A <strong>TalentPass</strong>, plataforma de educação corporativa desenvolvida e mantida
          pela <strong>Finhouse</strong> (CNPJ 60.806.192/0001-50), está comprometida em proteger a
          privacidade e os dados pessoais de seus usuários. Esta Política de Privacidade descreve
          como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais em
          conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
        </p>
      </section>

      {/* 2. Dados Coletados */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Dados Coletados</h2>
        <p className="mb-4">Coletamos os seguintes tipos de informações:</p>

        <h3 className="mb-3 text-xl font-semibold">2.1 Informações Fornecidas por Você</h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Nome completo</li>
          <li>Endereço de e-mail corporativo</li>
          <li>Informações profissionais (cargo, departamento)</li>
          <li>Dados de progresso e desempenho nos cursos</li>
          <li>Preferências de aprendizado</li>
        </ul>

        <h3 className="mb-3 text-xl font-semibold">2.2 Informações Coletadas Automaticamente</h3>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Endereço IP e localização geográfica aproximada</li>
          <li>Tipo de navegador e dispositivo</li>
          <li>Páginas visitadas e tempo de navegação</li>
          <li>Interações com o conteúdo da plataforma</li>
          <li>Cookies e tecnologias similares</li>
        </ul>
      </section>

      {/* 3. Base Legal e Finalidade */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Base Legal e Finalidade do Tratamento
        </h2>
        <p className="mb-4">Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li><strong>Execução de contrato:</strong> Para fornecer acesso à plataforma e serviços contratados</li>
          <li><strong>Cumprimento de obrigação legal:</strong> Para atender requisitos fiscais, trabalhistas e regulatórios</li>
          <li><strong>Legítimo interesse:</strong> Para aprimorar serviços, garantir segurança e personalizar a experiência</li>
          <li><strong>Consentimento:</strong> Para envio de comunicações institucionais e de marketing</li>
        </ul>
      </section>

      {/* 4. Uso dos Dados */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Uso dos Dados</h2>
        <p className="mb-4">Utilizamos seus dados para:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Fornecer, operar e manter a plataforma de educação corporativa</li>
          <li>Personalizar a experiência de aprendizado e sugerir conteúdos relevantes</li>
          <li>Acompanhar desempenho e gerar relatórios de progresso</li>
          <li>Enviar comunicações sobre novos cursos e atualizações</li>
          <li>Processar pagamentos e gerenciar assinaturas</li>
          <li>Melhorar continuamente a qualidade dos serviços</li>
          <li>Prevenir fraudes e garantir segurança</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>

      {/* 5. Compartilhamento */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Compartilhamento de Dados</h2>
        <p className="mb-4">
          Podemos compartilhar seus dados pessoais nas seguintes situações:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li><strong>Sua empresa:</strong> compartilhamento de relatórios de desempenho com administradores corporativos</li>
          <li><strong>Provedores de tecnologia:</strong> como Supabase (banco de dados e autenticação)</li>
          <li><strong>Gateways de pagamento:</strong> para processar transações de forma segura (ex: Eduzz, Stripe)</li>
          <li><strong>Autoridades legais:</strong> quando requerido por lei ou decisão judicial</li>
        </ul>
        <p className="mb-4">
          A TalentPass não vende, aluga ou comercializa dados pessoais sob nenhuma circunstância.
        </p>
      </section>

      {/* 6. Cookies */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Cookies e Tecnologias Similares</h2>
        <p className="mb-4">
          Utilizamos cookies para melhorar sua experiência. Os principais tipos são:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li><strong>Essenciais:</strong> Necessários para funcionamento do site</li>
          <li><strong>De desempenho:</strong> Para análise de uso e métricas de navegação</li>
          <li><strong>De funcionalidade:</strong> Para lembrar preferências e configurações</li>
        </ul>
        <p className="mb-4">
          Você pode desativar cookies nas configurações do navegador, mas isso pode afetar certas funcionalidades.
        </p>
      </section>

      {/* 7. Segurança */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Segurança dos Dados</h2>
        <p className="mb-4">
          Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados, incluindo:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Criptografia de dados em trânsito e repouso</li>
          <li>Controle de acesso baseado em papéis e autenticação segura</li>
          <li>Monitoramento contínuo e auditorias periódicas</li>
          <li>Treinamento interno em proteção de dados</li>
        </ul>
      </section>

      {/* 8. Retenção */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Retenção de Dados</h2>
        <p className="mb-4">
          Os dados são mantidos apenas pelo tempo necessário para cumprir as finalidades desta
          política ou conforme exigido por obrigações legais e contratuais.
        </p>
      </section>

      {/* 9. Direitos LGPD */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Seus Direitos (LGPD)</h2>
        <p className="mb-4">
          Em conformidade com a LGPD, você pode exercer os seguintes direitos:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Acessar e confirmar a existência de tratamento de dados</li>
          <li>Solicitar correção ou atualização de informações</li>
          <li>Solicitar exclusão, bloqueio ou anonimização de dados</li>
          <li>Solicitar portabilidade a outro fornecedor</li>
          <li>Revogar consentimento previamente concedido</li>
        </ul>
        <p className="mb-4">
          Para exercer seus direitos, entre em contato pelo WhatsApp{" "}
          <strong>(11) 95584-2951</strong>.
        </p>
      </section>

      {/* 10. Transferência Internacional */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. Transferência Internacional de Dados</h2>
        <p className="mb-4">
          Alguns dados podem ser processados fora do Brasil, em provedores de nuvem certificados.
          Garantimos a aplicação de medidas adequadas de proteção, conforme previsto na LGPD.
        </p>
      </section>

      {/* 11. Menores */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Menores de Idade</h2>
        <p className="mb-4">
          A TalentPass é destinada a profissionais e empresas. Não coletamos intencionalmente dados
          de menores de 18 anos sem consentimento de seus responsáveis legais.
        </p>
      </section>

      {/* 12. Alterações */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">12. Alterações desta Política</h2>
        <p className="mb-4">
          Esta Política de Privacidade pode ser atualizada periodicamente. Alterações relevantes
          serão comunicadas e a data de atualização será revisada no topo desta página.
        </p>
      </section>

      {/* 13. Contato */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">13. Contato e Encarregado de Dados</h2>
        <p className="mb-4">
          Para dúvidas, solicitações ou exercício de direitos de titular, entre em contato:
        </p>
        <ul className="list-none space-y-2">
          <li><strong>Empresa responsável:</strong> Finhouse – CNPJ 60.806.192/0001-50</li>
          <li><strong>Marca:</strong> TalentPass</li>
          <li><strong>WhatsApp:</strong> (11) 95584-2951</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
