import { useEffect, useState } from 'react'
import fallback from '../content/destaques-fallback.json'

const CAMINHO = `${import.meta.env.BASE_URL}data/destaques.json`

/**
 * Lê o JSON estático gerado pela Action de sincronização do Instagram.
 * Se o fetch falhar ou vier vazio, cai no arquivo versionado no repositório —
 * nunca deixa a interface em spinner eterno.
 */
export function useDestaques() {
  const [estado, setEstado] = useState({ carregando: true, itens: [], atualizadoEm: null })

  useEffect(() => {
    let ativo = true

    fetch(CAMINHO, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dados) => {
        if (!ativo) return
        const itens = Array.isArray(dados?.itens) ? dados.itens : []
        if (itens.length > 0) {
          setEstado({ carregando: false, itens, atualizadoEm: dados.atualizadoEm ?? null })
        } else {
          setEstado({ carregando: false, itens: fallback.itens, atualizadoEm: fallback.atualizadoEm })
        }
      })
      .catch(() => {
        if (!ativo) return
        setEstado({ carregando: false, itens: fallback.itens, atualizadoEm: fallback.atualizadoEm })
      })

    return () => { ativo = false }
  }, [])

  return estado
}

const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

export function dataPorExtenso(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

/** "2026-W33" -> "Semana de 10 a 16 de agosto" */
export function semanaPorExtenso(itens) {
  if (!itens?.length) return ''
  const datas = itens.map((i) => i.data).filter(Boolean).sort()
  const primeira = datas[0]
  const ultima = datas[datas.length - 1]
  if (!primeira) return ''
  const [, m1, d1] = primeira.split('-').map(Number)
  const [, m2, d2] = ultima.split('-').map(Number)
  if (primeira === ultima) return `Semana de ${d1} de ${MESES[m1 - 1]}`
  if (m1 === m2) return `Semana de ${d1} a ${d2} de ${MESES[m1 - 1]}`
  return `Semana de ${d1} de ${MESES[m1 - 1]} a ${d2} de ${MESES[m2 - 1]}`
}

export function agruparPorSemana(itens) {
  const mapa = new Map()
  for (const item of itens) {
    const chave = item.semana || item.data?.slice(0, 7) || 'sem-data'
    if (!mapa.has(chave)) mapa.set(chave, [])
    mapa.get(chave).push(item)
  }
  return [...mapa.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([chave, lista]) => ({
      chave,
      titulo: semanaPorExtenso(lista),
      itens: lista.sort((a, b) => (a.data < b.data ? 1 : -1)),
    }))
}
