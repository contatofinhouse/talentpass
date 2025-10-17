import LegalPageLayout from "@/components/LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Política de Privacidade" lastUpdated="Janeiro de 2025">
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Introdução</h2>
        <p className="mb-4">
          A TalentPass Tecnologia e Educação Ltda. ("TalentPass", "nós", "nosso") está comprometida
          em proteger a privacidade e os dados pessoais de nossos usuários. Esta Política de
          Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações
          pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
      </section>

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

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Base Legal e Finalidade do Tratamento</h2>
        <p className="mb-4">Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Execução de contrato:</strong> Para fornecer acesso à plataforma e serviços
            contratados
          </li>
          <li>
            <strong>Cumprimento de obrigação legal:</strong> Para atender requisitos fiscais,
            trabalhistas e regulatórios
          </li>
          <li>
            <strong>Legítimo interesse:</strong> Para melhorar nossos serviços, desenvolver novos
            recursos e garantir a segurança da plataforma
          </li>
          <li>
            <strong>Consentimento:</strong> Para envio de comunicações de marketing (quando aplicável)
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Uso dos Dados</h2>
        <p className="mb-4">Utilizamos seus dados para:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Fornecer, operar e manter nossa plataforma de educação</li>
          <li>Personalizar sua experiência de aprendizado</li>
          <li>Acompanhar seu progresso e gerar relatórios de desempenho</li>
          <li>Comunicar atualizações, novos conteúdos e informações relevantes</li>
          <li>Processar pagamentos e gerenciar assinaturas</li>
          <li>Melhorar nossos serviços através de análises e pesquisas</li>
          <li>Prevenir fraudes e garantir a segurança da plataforma</li>
          <li>Cumprir obrigações legais e regulatórias</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Compartilhamento de Dados</h2>
        <p className="mb-4">Podemos compartilhar seus dados com:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Sua organização empregadora:</strong> Compartilhamos dados de progresso e
            desempenho com administradores da sua empresa
          </li>
          <li>
            <strong>Provedores de serviços:</strong> Utilizamos o Supabase para hospedagem de banco
            de dados e autenticação
          </li>
          <li>
            <strong>Processadores de pagamento:</strong> Para processar transações financeiras de
            forma segura
          </li>
          <li>
            <strong>Autoridades legais:</strong> Quando exigido por lei ou para proteger nossos
            direitos legais
          </li>
        </ul>
        <p className="mb-4">
          Não vendemos, alugamos ou comercializamos seus dados pessoais para terceiros.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Cookies e Tecnologias Similares</h2>
        <p className="mb-4">
          Utilizamos cookies e tecnologias similares para melhorar sua experiência, incluindo:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Cookies essenciais:</strong> Necessários para o funcionamento da plataforma
          </li>
          <li>
            <strong>Cookies de desempenho:</strong> Para analisar como os usuários interagem com a
            plataforma
          </li>
          <li>
            <strong>Cookies de funcionalidade:</strong> Para lembrar suas preferências e
            configurações
          </li>
        </ul>
        <p className="mb-4">
          Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Segurança dos Dados</h2>
        <p className="mb-4">
          Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados
          pessoais contra acesso não autorizado, alteração, divulgação ou destruição, incluindo:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Controles de acesso rigorosos e autenticação segura</li>
          <li>Monitoramento contínuo de segurança</li>
          <li>Auditorias regulares de segurança</li>
          <li>Treinamento de equipe em práticas de proteção de dados</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Retenção de Dados</h2>
        <p className="mb-4">
          Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades
          descritas nesta política, a menos que um período de retenção mais longo seja exigido ou
          permitido por lei.
        </p>
        <p className="mb-4">
          Após o encerramento de sua conta, podemos reter alguns dados por períodos legalmente
          exigidos para fins fiscais, contábeis e de auditoria.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Seus Direitos (LGPD)</h2>
        <p className="mb-4">
          De acordo com a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los
          </li>
          <li>
            <strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou
            desatualizados
          </li>
          <li>
            <strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar a anonimização, bloqueio
            ou eliminação de dados desnecessários ou tratados em desconformidade
          </li>
          <li>
            <strong>Portabilidade:</strong> Solicitar a portabilidade de seus dados a outro fornecedor
          </li>
          <li>
            <strong>Eliminação:</strong> Solicitar a eliminação de dados tratados com base no
            consentimento
          </li>
          <li>
            <strong>Informação sobre compartilhamento:</strong> Saber com quais entidades públicas e
            privadas compartilhamos seus dados
          </li>
          <li>
            <strong>Revogação do consentimento:</strong> Revogar seu consentimento a qualquer momento
          </li>
        </ul>
        <p className="mb-4">
          Para exercer qualquer um desses direitos, entre em contato conosco através do WhatsApp
          (11) 95584-2951.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. Transferência Internacional de Dados</h2>
        <p className="mb-4">
          Seus dados podem ser transferidos e processados em servidores localizados fora do Brasil.
          Quando isso ocorrer, garantimos que medidas de proteção adequadas estejam em vigor,
          incluindo cláusulas contratuais padrão e certificações de segurança.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Menores de Idade</h2>
        <p className="mb-4">
          Nossa plataforma é destinada a profissionais e organizações empresariais. Não coletamos
          intencionalmente dados de menores de 18 anos sem o consentimento dos pais ou responsáveis
          legais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">12. Alterações nesta Política</h2>
        <p className="mb-4">
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre
          quaisquer alterações materiais publicando a nova política em nossa plataforma e atualizando
          a data de "Última atualização" no topo desta página.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">13. Contato e Encarregado de Dados</h2>
        <p className="mb-4">
          Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados
          pessoais, entre em contato conosco:
        </p>
        <ul className="list-none space-y-2">
          <li>
            <strong>TalentPass Tecnologia e Educação Ltda.</strong>
          </li>
          <li>
            <strong>CNPJ:</strong> 60.806.192/0001-50
          </li>
          <li>
            <strong>WhatsApp:</strong> (11) 95584-2951
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
