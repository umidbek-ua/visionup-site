import type { ReactNode } from 'react'

type PageSectionProps = {
  children: ReactNode
  title: string
}

function PageSection({ children, title }: PageSectionProps) {
  return (
    <section className="page-section" aria-labelledby={title.toLowerCase().replaceAll(' ', '-')}>
      <h2 id={title.toLowerCase().replaceAll(' ', '-')}>{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  )
}

export default PageSection
