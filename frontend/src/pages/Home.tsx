import DownloadButton from '../components/DownloadButton'
import { screenshots } from '../data/siteData'

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
        {screenshots.map((screenshot) => (
          <figure className="screenshot-frame" key={screenshot.src}>
            <img src={screenshot.src} alt={screenshot.alt} />
            <figcaption>{screenshot.caption}</figcaption>
          </figure>
        ))}
      </section>

      <DownloadButton />
    </main>
  )
}

export default Home
