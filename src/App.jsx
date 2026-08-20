import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Cabecalho from './components/Cabecalho'
import Rodape from './components/Rodape'
import Inicio from './pages/Inicio'
import Biografia from './pages/Biografia'
import Atuacao from './pages/Atuacao'
import Destaques from './pages/Destaques'
import Campanha from './pages/Campanha'
import DestaqueDetalhe from './pages/DestaqueDetalhe'
import Imprensa from './pages/Imprensa'
import Contato from './pages/Contato'

function AoTrocarDeRota() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const alvo = document.getElementById(hash.slice(1))
      if (alvo) { alvo.scrollIntoView(); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <a className="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>
      <AoTrocarDeRota />
      <Cabecalho />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/biografia" element={<Biografia />} />
          <Route path="/atuacao" element={<Atuacao />} />
          <Route path="/campanha" element={<Campanha />} />
          <Route path="/destaques" element={<Destaques />} />
          <Route path="/destaques/:slug" element={<DestaqueDetalhe />} />
          <Route path="/imprensa" element={<Imprensa />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
      <Rodape />
    </>
  )
}
