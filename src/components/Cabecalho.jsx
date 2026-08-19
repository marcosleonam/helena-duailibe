import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { perfil } from '../content/perfil'
import './cabecalho.css'

const NAV = [
  { para: '/biografia', rotulo: 'Quem é' },
  { para: '/atuacao', rotulo: 'Atuação' },
  { para: '/destaques', rotulo: 'Destaques' },
  { para: '/imprensa', rotulo: 'Imprensa' },
  { para: '/contato', rotulo: 'Contato' },
]

export default function Cabecalho() {
  const [reduzido, setReduzido] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const local = useLocation()

  useEffect(() => {
    const aoRolar = () => setReduzido(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => { setMenuAberto(false) }, [local.pathname])

  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuAberto])

  return (
    <header className={`cabecalho ${reduzido ? 'cabecalho--reduzido' : ''}`}>
      <div className="container cabecalho__interno">
        <Link to="/" className="marca" aria-label={`${perfil.nome} — início`}>
          <span className="marca__nome">{perfil.nome}</span>
          <span className="marca__cargo">{perfil.cargo} — Maranhão</span>
        </Link>

        <nav className="cabecalho__nav" aria-label="Navegação principal">
          {NAV.map((item) => (
            <NavLink
              key={item.para}
              to={item.para}
              className={({ isActive }) => `cabecalho__link ${isActive ? 'ativo' : ''}`}
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="cabecalho__botao-menu"
          aria-expanded={menuAberto}
          aria-controls="menu-painel"
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>
      </div>

      <div id="menu-painel" className={`painel ${menuAberto ? 'painel--aberto' : ''}`} hidden={!menuAberto}>
        <nav className="painel__nav" aria-label="Navegação principal (celular)">
          <NavLink to="/" className="painel__link">Início</NavLink>
          {NAV.map((item) => (
            <NavLink key={item.para} to={item.para} className="painel__link">{item.rotulo}</NavLink>
          ))}
        </nav>
        <a className="painel__instagram" href={perfil.instagram} target="_blank" rel="noopener noreferrer">
          {perfil.arroba}
        </a>
      </div>
    </header>
  )
}
