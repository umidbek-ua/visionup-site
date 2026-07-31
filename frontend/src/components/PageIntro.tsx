type PageIntroProps = {
  eyebrow: string
  title: string
  description: string
}

function PageIntro({ description, eyebrow, title }: PageIntroProps) {
  return (
    <section className="page-intro" aria-labelledby={`${eyebrow.toLowerCase()}-title`}>
      <p className="product-name">{eyebrow}</p>
      <h1 id={`${eyebrow.toLowerCase()}-title`}>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

export default PageIntro
