import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Guide from './pages/Guide'
import Home from './pages/Home'
import { pages, type Page } from './data/siteData'

function getCurrentPage(): Page {
  const hashPage = window.location.hash.replace('#', '').toLowerCase()
  return pages.includes(hashPage as Page) ? (hashPage as Page) : 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getCurrentPage)

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getCurrentPage())
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="app-shell">
      <Header currentPage={currentPage} />
      {currentPage === 'home' && <Home />}
      {currentPage === 'guide' && <Guide />}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}
      <Footer />
    </div>
  )
}

export default App
