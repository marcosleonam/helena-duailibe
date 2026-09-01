// Identificação. Fonte única: alterar aqui reflete no site inteiro.
export const perfil = {
  nome: 'Dra. Helena Duailibe',
  nomeCompleto: 'Helena Maria Duailibe Ferreira',
  cargo: 'Deputada Estadual',
  casa: 'Assembleia Legislativa do Maranhão',
  siglaCasa: 'ALEMA',
  partido: 'Republicanos',
  // Numero de urna para deputada estadual (cartao do TSE). O "10" isolado
  // e o numero do PARTIDO, nao o dela — nao usar sozinho.
  numero: '10369',
  instagram: 'https://www.instagram.com/helenaduailibe/',
  arroba: '@helenaduailibe',
  paginaAlema: 'https://www.al.ma.leg.br/sitealema/deputado/dra-helena-duailibe/',

  // Campo vazio NÃO é exibido no site. Nunca colocar texto do tipo
  // "[CONFIRMAR]" aqui: isso vaza anotação interna para o eleitor.
  // Endereço e telefone seguem pendentes com a assessoria (ver README).
  gabinete: {
    endereco: '',
    telefone: '',
    email: 'contato@helenaduailibe.com.br',
    whatsapp: '', // vazio = botão de WhatsApp não é exibido
  },

  // Identificação exigida em propaganda eleitoral na internet
  // (Lei 9.504/97, art. 57-B e Res. TSE 23.610/2019). Responsável = o nome do
  // rótulo eleitoral aprovado pela Meta; CNPJ = o da campanha, conforme cartão.
  eleitoral: {
    exibir: true,
    responsavel: 'ELEIÇÃO 2026 HELENA MARIA DUAILIBE FERREIRA DEPUTADO ESTADUAL',
    cnpj: '68.345.272/0001-67',
  },
}

export const posicionamento = {
  texto:
    'Quero continuar sendo a voz da população maranhense na Assembleia Legislativa, defendendo os princípios em que acredito e trabalhando por mais qualidade de vida para todos.',
  autoria: 'Dra. Helena Duailibe',
}
