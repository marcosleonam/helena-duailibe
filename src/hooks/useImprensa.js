import { useEffect, useState } from 'react'
import { imprensa as fallback } from '../content/imprensa'

const CAMINHO = `${import.meta.env.BASE_URL}data/imprensa.json`

/**
 * Clipping de imprensa vindo do painel /admin, para a assessoria publicar
 * matéria nova sem depender de ninguém.
 *
 * Se o arquivo ainda não existe (ou o servidor está fora), cai na lista
 * versionada em src/content/imprensa.js — a página nunca fica vazia por falha.
 * Lista vazia vinda do painel é decisão editorial e é respeitada; só a AUSÊNCIA
 * do arquivo aciona o fallback.
 */
export function useImprensa() {
  const [itens, setItens] = useState(fallback)

  useEffect(() => {
    let ativo = true

    fetch(CAMINHO, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dados) => {
        if (ativo && Array.isArray(dados?.itens)) setItens(dados.itens)
      })
      .catch(() => {})

    return () => { ativo = false }
  }, [])

  return itens
}
