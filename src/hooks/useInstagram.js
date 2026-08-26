import { useEffect, useState } from 'react'

const CAMINHO = `${import.meta.env.BASE_URL}data/instagram.json`

/**
 * Lê o JSON gerado por scripts/sync-instagram.mjs com TODAS as publicações do
 * perfil oficial no período da campanha. Cada item traz o `permalink` da
 * publicação original — é o que liga cada peça ao post dela no Instagram.
 *
 * Se o arquivo ainda não existir (primeira sincronização) a lista volta vazia e
 * a seção simplesmente não é exibida — nunca spinner eterno, nunca erro na tela.
 */
export function useInstagram() {
  const [estado, setEstado] = useState({ carregando: true, itens: [], atualizadoEm: null })

  useEffect(() => {
    let ativo = true

    fetch(CAMINHO, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dados) => {
        if (!ativo) return
        setEstado({
          carregando: false,
          itens: Array.isArray(dados?.itens) ? dados.itens : [],
          atualizadoEm: dados?.atualizadoEm ?? null,
        })
      })
      .catch(() => {
        if (!ativo) return
        setEstado({ carregando: false, itens: [], atualizadoEm: null })
      })

    return () => { ativo = false }
  }, [])

  return estado
}
