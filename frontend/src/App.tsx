import './App.css'
import Header from './components/Header'
import DownloadButton from './components/DownloadButton'
import Footer from './components/Footer'
import visionupOne from '../image/visionup1.png'
import visionupTwo from '../image/visionup2.png'
import visionupThree from '../image/visionup3.png'

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

function App() {
  return (
    <div className="app-shell">
      <Header />
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
      <Footer />
    </div>
  )
}

export default App
