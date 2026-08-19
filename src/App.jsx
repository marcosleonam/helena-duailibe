import Header from './components/Header'
import Hero from './components/Hero'
import Credenciais from './components/Credenciais'
import Trajetoria from './components/Trajetoria'
import Pautas from './components/Pautas'
import Realizacoes from './components/Realizacoes'
import Contato from './components/Contato'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Credenciais />
        <Trajetoria />
        <Pautas />
        <Realizacoes />
        <Contato />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
