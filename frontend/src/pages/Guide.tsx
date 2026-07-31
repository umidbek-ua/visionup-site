import PageIntro from '../components/PageIntro'
import PageSection from '../components/PageSection'

const audience = [
  'Low-vision users',
  'Users who find it difficult to see text and interface elements on screen',
  'Users who need fast and comfortable screen zoom',
]

const steps = [
  'Download VisionUp',
  'Install the DMG',
  'Open the application',
  'Configure zoom settings',
  'Save a profile',
  'Use keyboard shortcuts',
]

const features = [
  'Fast Zoom',
  'Smooth Zoom',
  'Zoom Settings',
  'Profiles',
  'Keyboard Shortcuts',
  'Profile Import and Export',
]

const accessibility = [
  'Large controls',
  'High contrast',
  'Keyboard-friendly navigation',
  'Low-vision-first interface',
  'Clear visual hierarchy',
  'Scalable interface',
]

function Guide() {
  return (
    <main id="guide" className="content-page">
      <PageIntro
        eyebrow="Guide"
        title="Learn how VisionUp helps make screen magnification faster and clearer."
        description="This guide explains the app, who it is for, and the basic workflow for getting started."
      />

      <div className="section-grid">
        <PageSection title="What is VisionUp?">
          <p>
            VisionUp is a screen magnification desktop application created for
            low-vision users. It helps make screen content easier to see with
            fast zoom controls, profiles, and a clear interface.
          </p>
        </PageSection>

        <PageSection title="Who is it for?">
          <ul className="feature-list">
            {audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PageSection>

        <PageSection title="How does it work?">
          <ol className="step-list">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </PageSection>

        <PageSection title="Main Features">
          <ul className="feature-list two-column-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </PageSection>

        <PageSection title="Accessibility">
          <ul className="feature-list two-column-list">
            {accessibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </PageSection>

        <PageSection title="Installation">
          <p className="flow-line">
            Download DMG <span>→</span> Open DMG <span>→</span> Move VisionUp to
            Applications <span>→</span> Open VisionUp
          </p>
        </PageSection>

        <PageSection title="Basic Usage">
          <p>
            Open VisionUp, choose a comfortable zoom level, adjust the settings,
            and save the setup as a profile. This placeholder text can be
            replaced with detailed app instructions later.
          </p>
        </PageSection>

        <PageSection title="Keyboard Shortcuts">
          <div className="shortcut-list">
            <p>
              <kbd>Option</kbd> + <kbd>Plus</kbd>
              <span>Increase zoom</span>
            </p>
            <p>
              <kbd>Option</kbd> + <kbd>Minus</kbd>
              <span>Decrease zoom</span>
            </p>
            <p>
              <kbd>Option</kbd> + <kbd>0</kbd>
              <span>Reset zoom</span>
            </p>
          </div>
        </PageSection>
      </div>
    </main>
  )
}

export default Guide
