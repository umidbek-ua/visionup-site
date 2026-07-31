import PageIntro from '../components/PageIntro'
import PageSection from '../components/PageSection'

function About() {
  return (
    <main id="about" className="content-page narrow-page">
      <PageIntro
        eyebrow="About"
        title="VisionUp is built to make screen magnification feel fast, simple and comfortable."
        description="The project is focused on practical accessibility for people who need clearer screen visibility every day."
      />

      <PageSection title="Why VisionUp exists">
        <p>
          VisionUp is an accessibility-focused desktop application created to
          make screen magnification faster, simpler and more comfortable for
          low-vision users.
        </p>
        <p>
          Many screen zoom workflows are slow, hard to adjust, or not designed
          around repeated daily use. VisionUp aims to solve that with large
          controls, saved profiles, keyboard-friendly navigation, and a clear
          visual hierarchy.
        </p>
        <p>
          The goal is to help low-vision users switch zoom settings quickly and
          keep the screen easier to see without unnecessary complexity. VisionUp
          is currently in active development, so features and copy may change as
          the desktop app evolves.
        </p>
      </PageSection>
    </main>
  )
}

export default About
