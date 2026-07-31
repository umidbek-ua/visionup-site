import { useEffect, useState } from 'react'
import DownloadButton from '../components/DownloadButton'
import { downloadInfo, screenshots } from '../data/siteData'
import { getLatestRelease, type LatestRelease } from '../services/api'

function Home() {
  const [release, setRelease] = useState<LatestRelease | null>(null)
  const [isLoadingRelease, setIsLoadingRelease] = useState(true)
  const [releaseError, setReleaseError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadRelease() {
      setIsLoadingRelease(true)
      setReleaseError('')

      try {
        const latestRelease = await getLatestRelease()

        if (isCurrent) {
          setRelease(latestRelease)
        }
      } catch {
        if (isCurrent) {
          setRelease(null)
          setReleaseError('Download is temporarily unavailable.')
        }
      } finally {
        if (isCurrent) {
          setIsLoadingRelease(false)
        }
      }
    }

    loadRelease()

    return () => {
      isCurrent = false
    }
  }, [])

  const releaseMeta = release
    ? [
        `Version ${release.version}`,
        release.platform,
        release.architecture,
        release.file_size,
      ].filter(Boolean)
    : downloadInfo.meta

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

      <DownloadButton
        downloadUrl={release?.download_url}
        errorMessage={releaseError}
        isLoading={isLoadingRelease}
        meta={releaseMeta}
      />
    </main>
  )
}

export default Home
