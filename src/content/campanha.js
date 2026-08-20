// Material de campanha (fotos e vídeos das ruas). Fonte única: para publicar
// uma peça nova, jogue o arquivo em public/img/campanha ou public/video e
// acrescente uma entrada aqui — nenhum componente precisa ser tocado.
import { perfil } from './perfil'

/**
 * Vídeos verticais (9:16) das ações de rua.
 * - arquivo: caminho a partir de public/
 * - poster:  quadro estático exibido antes do play (o vídeo só baixa no toque)
 */
export const videos = [
  {
    id: 'caminhada-centro',
    titulo: 'Caminhada no Centro Histórico de São Luís',
    resumo:
      'Rua cheia na caminhada ao lado do candidato a governador Orleans Brandão. Bandeiras, abraço e o pedido de voto feito olho no olho, quarteirão por quarteirão.',
    data: '2026-08-19',
    arquivo: 'video/caminhada-centro.mp4',
    poster: 'img/campanha/poster-caminhada-centro.jpg',
    permalink: perfil.instagram,
  },
]

/**
 * Cards de campanha — fotos 4/5 das peças publicadas no perfil oficial.
 * `destaque: true` marca a peça-chave, que ocupa o dobro de largura no desktop.
 */
export const galeria = [
  {
    id: 'missao-maranhao',
    imagem: 'img/campanha/missao-maranhao.jpg',
    titulo: 'Minha missão é o Maranhão inteiro',
    legenda:
      'A peça-síntese da campanha: quarenta anos de medicina viram compromisso com o estado todo, não só com a capital.',
    destaque: true,
  },
  {
    id: 'comite-bencao',
    imagem: 'img/campanha/comite-01.jpg',
    titulo: 'Bênção de abertura do Comitê Central',
    legenda: 'Padres e apoiadores em oração na abertura oficial do comitê de campanha.',
  },
  {
    id: 'comite-fala',
    imagem: 'img/campanha/comite-02.jpg',
    titulo: 'A palavra da candidata no comitê',
    legenda: 'Helena fala ao microfone cercada por lideranças religiosas e pela militância.',
  },
  {
    id: 'comite-abraco',
    imagem: 'img/campanha/comite-03.jpg',
    titulo: 'Comitê aberto, porta aberta',
    legenda: 'O abraço de quem chegou para conhecer a casa da campanha em São Luís.',
  },
  {
    id: 'comite-lideranca',
    imagem: 'img/campanha/comite-04.jpg',
    titulo: 'Chapa reunida na inauguração',
    legenda: 'Os cartazes da chapa lado a lado: governo, senado e a candidatura a deputada estadual.',
  },
  {
    id: 'comite-microfone',
    imagem: 'img/campanha/comite-05.jpg',
    titulo: 'Comitê Central lotado',
    legenda: 'Apoiadores se revezam no microfone para declarar apoio à candidatura 10369.',
  },
  {
    id: 'adesivaco',
    imagem: 'img/campanha/comite-06.jpg',
    titulo: 'Adesivaço: o 10369 nas ruas',
    legenda: 'Carro adesivado com o número da candidatura circulando pelos bairros de São Luís.',
  },
  {
    id: 'comite-rua',
    imagem: 'img/campanha/comite-07.jpg',
    titulo: 'Encontro na porta do comitê',
    legenda: 'Bandeira erguida e conversa com moradores que pararam para cumprimentar a candidata.',
  },
  {
    id: 'comite-apoiadores',
    imagem: 'img/campanha/comite-08.jpg',
    titulo: 'Foto com quem faz a campanha',
    legenda: 'Apoiadores registram o momento com Helena diante do painel “Cuidar das pessoas”.',
  },
  {
    id: 'comite-familias',
    imagem: 'img/campanha/comite-09.jpg',
    titulo: 'Famílias no comitê',
    legenda: 'Três gerações no mesmo registro — o público que acompanha a candidatura desde a saúde pública.',
  },
  {
    id: 'comite-equipe',
    imagem: 'img/campanha/comite-10.jpg',
    titulo: 'A equipe que faz acontecer',
    legenda: 'Voluntárias e voluntários que sustentam a operação de rua da campanha.',
  },
  {
    id: 'comite-militancia',
    imagem: 'img/campanha/comite-11.jpg',
    titulo: 'Militância reunida',
    legenda: 'O time de rua da campanha reunido no comitê antes de mais um dia de panfletagem.',
  },
]
