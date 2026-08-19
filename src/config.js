// ============================================================
// FONTE UNICA DE VERDADE DO SITE — trocar so aqui.
// ============================================================
export const site = {
  nome: 'Helena Duailibe',
  nomeCompleto: 'Helena Maria Duailibe Ferreira',
  cargo: 'Deputada Estadual',
  estado: 'Maranhão',
  partido: 'Republicanos',
  numero: '10369',

  // CONFIRMAR COM O MARCOS: numero publico da campanha (assessoria)
  whatsapp: '5598982437286',
  mensagemPadrao: 'Olá! Vim pelo site da deputada Helena Duailibe e quero falar com a equipe.',

  email: 'contato@helenaduailibe.com.br',
  instagram: 'https://www.instagram.com/helenaduailibe/',
  facebook: '',
  cidade: 'São Luís',

  // Dados legais obrigatorios no rodape (Lei 9.504/97 e Res. TSE 23.610/2019)
  legal: {
    razaoSocial: 'ELEIÇÃO 2026 HELENA MARIA DUAILIBE FERREIRA DEPUTADO ESTADUAL',
    cnpj: '68.345.272/0001-67',
    endereco: 'Rua Professor Ronald Carvalho, 09 — Renascença, São Luís/MA, CEP 65075-035',
  },
}

export function whatsappLink(texto = site.mensagemPadrao) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`
}
