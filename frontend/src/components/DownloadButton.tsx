import { downloadInfo } from '../data/siteData'

interface DownloadButtonProps {
  downloadUrl?: string
  isLoading: boolean
  errorMessage: string
  meta: string[]
}

function DownloadButton({ downloadUrl, isLoading, errorMessage, meta }: DownloadButtonProps) {
  const isUnavailable = isLoading || Boolean(errorMessage) || !downloadUrl
  const statusMessage = isLoading ? 'Loading release...' : errorMessage

  return (
    <div className="download-area">
      <a
        aria-disabled={isUnavailable}
        aria-label={downloadInfo.label}
        className="download-button"
        href={isUnavailable ? undefined : downloadUrl}
        onClick={(event) => {
          if (isUnavailable) {
            event.preventDefault()
          }
        }}
      >
        {downloadInfo.label}
      </a>
      <p className="download-meta">{meta.join(' · ')}</p>
      {statusMessage && (
        <p className="download-status" role={errorMessage ? 'alert' : 'status'}>
          {statusMessage}
        </p>
      )}
    </div>
  )
}

export default DownloadButton
