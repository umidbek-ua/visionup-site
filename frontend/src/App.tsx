import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import DownloadButton from './components/DownloadButton'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Guide from './pages/Guide'
import visionupOne from '../image/visionup1.png'
import visionupTwo from '../image/visionup2.png'
import visionupThree from '../image/visionup3.png'

const pages = ['home', 'guide', 'about', 'contact'] as const
type Page = (typeof pages)[number]

const screenshots = [
  {
    src: visionupOne,
    alt: 'VisionUp magnification preview placeholder',
  },
  {
    src: visionupTwo,
    alt: 'VisionUp profile switching preview placeholder',
  },
  {
    src: visionupThree,
    alt: 'VisionUp screen visibility preview placeholder',
  },
]

function getCurrentPage(): Page {
  const hashPage = window.location.hash.replace('#', '').toLowerCase()
  return pages.includes(hashPage as Page) ? (hashPage as Page) : 'home'
}

function Home() {
  return (
    <main id="home" className="home-page">
      <section className="intro-section" aria-labelledby="home-title">
        <p className="product-name">VisionUp</p>
        <h1 id="home-title">
          A simple screen magnification app designed for low-vision users.
        </h1>
        <p className="intro-copy">
          Zoom faster, switch profiles and make your screen easier to see.
        </p>
      </section>

      <section className="screenshots-section" aria-label="VisionUp screenshots">
        {screenshots.map((screenshot, index) => (
          <figure className="screenshot-frame" key={screenshot.src}>
            <img src={screenshot.src} alt={screenshot.alt} />
            <figcaption>Preview {index + 1}</figcaption>
          </figure>
        ))}
      </section>

      <DownloadButton />
    </main>
  )
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
