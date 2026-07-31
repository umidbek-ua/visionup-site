import { downloadInfo } from '../data/siteData'

function DownloadButton() {
  return (
    <div className="download-area">
      <a className="download-button" href={downloadInfo.href} aria-label={downloadInfo.label}>
        {downloadInfo.label}
      </a>
      <p className="download-meta">{downloadInfo.meta.join(' · ')}</p>
    </div>
  )
}

export default DownloadButton
