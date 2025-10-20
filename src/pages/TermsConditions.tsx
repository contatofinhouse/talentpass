import LegalPageLayout from "@/components/LegalPageLayout";

const TermsConditions = () => {
  return (
    <LegalPageLayout title="Termos e Condições de Uso" lastUpdated="17 de outubro de 2025">
      {/* 1. Aceitação */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar e usar a plataforma <strong>TalentPass</strong>, você concorda em cumprir e
          estar vinculado a estes Termos e Condições de Uso. Se não concordar com qualquer parte,
          você não deve utilizar nossos serviços.
        </p>
        <p className="mb-4">
          Estes termos aplicam-se a todos os visitantes, usuários e organizações que acessam ou usam
          o serviço.
        </p>
      </section>

      {/* 2. Sobre o TalentPass / Razão social */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Sobre o TalentPass</h2>
        <p className="mb-4">
          <strong>TalentPass</strong> é uma plataforma de educação corporativa baseada em
          microlearning, desenvolvida e mantida por <strong>Finhouse</strong>, inscrita no{" "}
          <strong>CNPJ 60.806.192/0001-50</strong>.
        </p>
        <p className="mb-4">
          Oferecemos conteúdo educacional interativo e personalizado para desenvolvimento
          profissional por meio de uma plataforma web moderna e acessível.
        </p>
      </section>

      {/* 3. Cadastro e Conta */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Cadastro e Conta de Usuário</h2>
        <p className="mb-4">
          Para acessar determinadas funcionalidades, você poderá precisar criar uma conta. Ao criar
          uma conta, você concorda em:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Fornecer informações verdadeiras, precisas, atuais e completas;</li>
          <li>Manter e atualizar prontamente suas informações de registro;</li>
          <li>Manter a segurança e confidencialidade de sua senha;</li>
          <li>Notificar-nos imediatamente sobre qualquer uso não autorizado;</li>
          <li>Ser responsável por todas as atividades realizadas sob sua conta.</li>
        </ul>
      </section>

      {/* 4. Planos e Pagamentos */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Planos e Pagamentos</h2>
        <p className="mb-4">
          A TalentPass oferece diferentes planos de assinatura para empresas e organizações, que
          podem incluir períodos de teste, modalidades mensais ou anuais e recursos adicionais.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Os preços podem ser alterados com aviso prévio de 30 (trinta) dias;</li>
          <li>As cobranças são processadas de acordo com o plano escolhido (mensal ou anual);</li>
          <li>Não há reembolso de períodos já pagos, exceto quando exigido por lei;</li>
          <li>
            O cancelamento pode ser solicitado a qualquer momento e terá efeito ao final do ciclo de
            cobrança vigente.
          </li>
        </ul>
        <p className="mb-4">
          Pagamentos podem ser processados por parceiros de pagamento seguros (por exemplo, Eduzz,
          Stripe ou equivalentes).
        </p>
      </section>

      {/* 5. Uso Aceitável */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Uso Aceitável</h2>
        <p className="mb-4">Você concorda em NÃO:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Usar a plataforma para qualquer finalidade ilegal ou não autorizada;</li>
          <li>Violar quaisquer leis aplicáveis em sua jurisdição;</li>
          <li>Transmitir material ilegal, ofensivo, difamatório ou prejudicial;</li>
          <li>Tentar obter acesso não autorizado a sistemas ou redes da plataforma;</li>
          <li>Interferir ou interromper o serviço ou servidores;</li>
          <li>Reproduzir, duplicar, copiar, vender ou explorar o serviço sem permissão.</li>
        </ul>
      </section>

      {/* 6. Propriedade Intelectual */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Propriedade Intelectual</h2>
        <p className="mb-4">
          Todo o conteúdo presente na plataforma TalentPass — incluindo textos, gráficos, logotipos,
          ícones, imagens, vídeos, áudios e software — é de propriedade da Finhouse e/ou de seus
          parceiros, protegido pelas leis brasileiras e internacionais de direitos autorais.
        </p>
        <p className="mb-4">
          É concedida a você uma licença limitada, não exclusiva e intransferível para acessar e usar
          o conteúdo educacional para fins de desenvolvimento profissional pessoal ou corporativo.
        </p>
      </section>

      {/* 7. Privacidade e Proteção de Dados (LGPD) */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Privacidade e Proteção de Dados (LGPD)</h2>
        <p className="mb-4">
          A Finhouse observa a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). As informações
          fornecidas pelos usuários são tratadas com confidencialidade e utilizadas apenas para
          autenticação, comunicação e melhoria dos serviços, conforme descrito em nossa Política de
          Privacidade.
        </p>
      </section>

      {/* 8. Limitação de Responsabilidade */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Limitação de Responsabilidade</h2>
        <p className="mb-4">A TalentPass não se responsabiliza por:</p>
        <ul className="mb-4 list-disc space-y-2 pl-6">
          <li>Danos indiretos, incidentais, especiais ou consequenciais;</li>
          <li>Perda de lucros, receita, dados ou uso;</li>
          <li>Interrupções, falhas técnicas ou erros no serviço;</li>
          <li>Ações de terceiros ou conteúdo de terceiros.</li>
        </ul>
        <p className="mb-4">
          O serviço é fornecido “no estado em que se encontra” e “conforme disponível”, sem garantias
          de qualquer tipo.
        </p>
      </section>

      {/* 9. Modificações dos Termos */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Modificações destes Termos</h2>
        <p className="mb-4">
          Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Em caso
          de alteração material, envidaremos esforços razoáveis para fornecer aviso com antecedência
          mínima de 30 (trinta) dias.
        </p>
        <p className="mb-4">
          O uso continuado da plataforma após quaisquer alterações constitui aceitação dos termos
          modificados.
        </p>
      </section>

      {/* 10. Lei Aplicável e Foro */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. Lei Aplicável e Foro</h2>
        <p className="mb-4">
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da
          Comarca de <strong>São Paulo/SP</strong>, com renúncia a qualquer outro, por mais
          privilegiado que seja, para dirimir eventuais controvérsias.
        </p>
      </section>

      {/* 11. Contato */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">11. Contato</h2>
        <p className="mb-4">Em caso de dúvidas sobre estes Termos e Condições, fale com a gente:</p>
        <ul className="list-none space-y-2">
          <li>
            <strong>WhatsApp:</strong> (11) 95584-2951
          </li>
          <li>
            <strong>Marca:</strong> TalentPass
          </li>
          <li>
            <strong>Empresa responsável:</strong> Finhouse – CNPJ 60.806.192/0001-50
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};

export default TermsConditions;
