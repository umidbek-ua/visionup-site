import PageIntro from '../components/PageIntro'
import PageSection from '../components/PageSection'
import { guideSections } from '../data/guideData'

function Guide() {
  return (
    <main id="guide" className="content-page">
      <PageIntro
        eyebrow="Guide"
        title="Learn how VisionUp helps make screen magnification faster and clearer."
        description="This guide explains the app, who it is for, and the basic workflow for getting started."
      />

      <div className="section-grid">
        {guideSections.map((section) => (
          <PageSection key={section.title} title={section.title}>
            {'body' in section && <p>{section.body}</p>}
            {section.items && (
              <ul className={`feature-list ${section.columns ? 'two-column-list' : ''}`}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.orderedItems && (
              <ol className="step-list">
                {section.orderedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
            {section.flow && (
              <p className="flow-line">
                {section.flow.map((item, index) => (
                  <span className="flow-item" key={item}>
                    {index > 0 && <span aria-hidden="true">→</span>}
                    {item}
                  </span>
                ))}
              </p>
            )}
            {section.shortcuts && (
              <div className="shortcut-list">
                {section.shortcuts.map((shortcut) => (
                  <p key={shortcut.action}>
                    {shortcut.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                    <span>{shortcut.action}</span>
                  </p>
                ))}
              </div>
            )}
          </PageSection>
        ))}
      </div>
    </main>
  )
}

export default Guide
