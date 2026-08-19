// Eixos de atuação. Todo dado factual carrega fonte clicável.
// Itens marcados com pendente: true NÃO são publicados até a assessoria confirmar.
export const eixos = [
  {
    numero: '01',
    slug: 'saude-publica',
    titulo: 'Saúde pública',
    resumo:
      'Quatro décadas de gestão em saúde traduzidas em atuação legislativa — do pronto-socorro à Secretaria de Estado, e agora no acompanhamento da rede pública maranhense.',
    paragrafos: [
      'A atuação em saúde é o eixo onde a experiência de gestão vira trabalho parlamentar: acompanhamento da rede pública, defesa de investimento em média e alta complexidade e atenção aos serviços que dependem de estrutura permanente para funcionar.',
      'Em discurso na Assembleia Legislativa em 8 de julho de 2025, destacou o primeiro transplante de coração realizado no Maranhão, no Hospital Universitário Presidente Dutra, em São Luís: “Esse transplante é um marco na história da medicina maranhense.”',
    ],
    fonte: {
      texto: 'Discurso na Assembleia Legislativa do Maranhão, 8/7/2025',
      url: 'https://www.al.ma.leg.br/sitealema/deputado/dra-helena-duailibe/',
    },
    pendente: false,
  },
  {
    numero: '02',
    slug: 'seguranca-no-transito',
    titulo: 'Segurança no trânsito',
    resumo:
      'Projeto de lei que cria o Cadastro Estadual de Motoristas Envolvidos em Crimes de Trânsito, com inscrição apenas após condenação transitada em julgado.',
    paragrafos: [
      'O projeto reúne identificação, tipo de crime, data, local e desfecho processual, com caráter administrativo e informativo e compartilhamento de dados em conformidade com a Lei Geral de Proteção de Dados. A inscrição no cadastro só ocorre após condenação transitada em julgado.',
      'O objetivo declarado é apoiar políticas de segurança pública, identificar reincidentes e orientar ações educativas e de reinserção social — prevenção e redução de riscos, não punição adicional.',
    ],
    fonte: {
      texto: 'Noticiado em abril de 2026; à época, aguardando parecer das comissões',
      url: '',
    },
    confirmar: 'Número do PL e situação atual da tramitação.',
    pendente: false,
  },
  {
    numero: '03',
    slug: 'mulheres-e-protecao-social',
    titulo: 'Mulheres e proteção social',
    resumo:
      'Histórico de implantação de centro de saúde da mulher e integração à maior bancada feminina da história da Assembleia Legislativa do Maranhão.',
    paragrafos: [
      'A pauta nasce da própria trajetória na gestão da saúde: a implantação de um centro de saúde da mulher, ainda como Secretária de Estado, e o trabalho de proteção social conduzido à frente da Secretaria de Políticas para Comunidades.',
      'Na Assembleia, integra a maior bancada feminina já eleita para a Casa.',
    ],
    fonte: {
      texto: 'Perfil oficial na Assembleia Legislativa do Maranhão',
      url: 'https://www.al.ma.leg.br/sitealema/deputado/dra-helena-duailibe/',
    },
    confirmar:
      'Autoria da ferramenta eletrônica de avaliação de risco de violência contra a mulher aprovada na ALEMA — não publicar sem confirmação do gabinete.',
    pendente: false,
  },
  {
    numero: '04',
    slug: 'desenvolvimento-comunidades-e-cultura',
    titulo: 'Desenvolvimento, comunidades e cultura',
    resumo:
      'Microcrédito para pequenos empreendedores, valorização das tradições populares do interior e preservação da água.',
    paragrafos: [
      'No discurso de julho de 2025, destacou o acordo de cooperação técnica entre o Governo do Estado, a FAMEM e o Banco do Nordeste para ampliar o acesso ao microcrédito de pequenos empreendedores, além da valorização das tradições populares e dos eventos religiosos do interior do estado.',
      'Em março de 2026, promoveu no auditório Gervásio Santos, na Assembleia Legislativa, um seminário sobre a importância da preservação da água, em alusão ao Dia Mundial da Água, com a proposta de criação de um Fórum Permanente de Recursos Hídricos.',
    ],
    fonte: {
      texto: 'Zeca Soares, 31/3/2026, e discurso na Assembleia Legislativa, 8/7/2025',
      url: 'https://www.zecasoares.com/2026/03/31/helena-duailibe-promove-seminario-sobre-a-importancia-da-agua/',
    },
    pendente: false,
  },
]

export const fechamentoAtuacao = {
  texto:
    'um estado mais justo, com qualidade de vida, respeito às tradições e oportunidades para todos.',
  fonte: 'Discurso na Assembleia Legislativa do Maranhão, 8/7/2025',
}
