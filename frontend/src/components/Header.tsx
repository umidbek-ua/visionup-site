import { navigationItems, type Page } from '../data/siteData'

type HeaderProps = {
  currentPage: Page
}

function Header({ currentPage }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="text-logo" href="#home" aria-label="VisionUp home">
        <span className="logo-mark" aria-hidden="true">
          VU
        </span>
        <span>VisionUp</span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <a
            aria-current={currentPage === item.page ? 'page' : undefined}
            key={item.page}
            href={`#${item.page}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
