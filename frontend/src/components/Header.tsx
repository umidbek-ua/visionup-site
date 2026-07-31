const navigationItems = ['Home', 'Guide', 'About', 'Contact']

type HeaderProps = {
  currentPage: string
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
            aria-current={currentPage === item.toLowerCase() ? 'page' : undefined}
            key={item}
            href={`#${item.toLowerCase()}`}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
