/**
 * Aplica a seleção editorial da assessoria sobre o feed bruto do Instagram.
 *
 * Três arquivos, em <saida>/data:
 *   publicacoes.json  fonte da verdade — tudo que o robô leu do Instagram
 *   editorial.json    o que o painel /admin decidiu ({ ocultos, fixados })
 *   instagram.json    o que o site mostra em /campanha  (derivado)
 *   destaques.json    o que o site mostra em /destaques (derivado)
 *
 * Os dois derivados são recalculados aqui e SÓ aqui — por isso tanto o robô de
 * sincronização quanto o painel chamam esta mesma função. Mudança no painel
 * aparece no site na hora, sem esperar a próxima leitura do Instagram.
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const TETO_DESTAQUES = 12

export function lerJson(caminho, padrao) {
  try {
    return JSON.parse(readFileSync(caminho, 'utf8'))
  } catch {
    return padrao
  }
}

export function aplicarEditorial(saida) {
  const pastaDados = resolve(saida, 'data')
  mkdirSync(pastaDados, { recursive: true })

  const bruto = lerJson(resolve(pastaDados, 'publicacoes.json'), { itens: [] })
  const editorial = lerJson(resolve(pastaDados, 'editorial.json'), {})

  const ocultos = new Set(editorial.ocultos ?? [])
  const fixados = editorial.fixados ?? []

  const visiveis = (bruto.itens ?? [])
    .filter((i) => !ocultos.has(i.code))
    .sort((a, b) => (a.data < b.data ? 1 : -1))

  // fixados sobem para o topo dos destaques, na ordem em que a assessoria ordenou
  const noTopo = fixados.map((code) => visiveis.find((i) => i.code === code)).filter(Boolean)
  const resto = visiveis.filter((i) => !fixados.includes(i.code))
  const destaques = [...noTopo, ...resto].slice(0, TETO_DESTAQUES)

  const atualizadoEm = bruto.atualizadoEm ?? new Date().toISOString()

  writeFileSync(
    resolve(pastaDados, 'instagram.json'),
    `${JSON.stringify({ atualizadoEm, itens: visiveis }, null, 2)}\n`
  )
  writeFileSync(
    resolve(pastaDados, 'destaques.json'),
    `${JSON.stringify({ atualizadoEm, itens: destaques }, null, 2)}\n`
  )

  return { publicadas: visiveis.length, destaques: destaques.length, ocultas: ocultos.size }
}
