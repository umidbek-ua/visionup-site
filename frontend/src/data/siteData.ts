export const pages = ['home', 'guide', 'about', 'contact'] as const

export type Page = (typeof pages)[number]

export const navigationItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Guide', page: 'guide' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

export const screenshots = [
  {
    src: '/visionup1.png',
    alt: 'VisionUp magnification preview placeholder',
    caption: 'Preview 1',
  },
  {
    src: '/visionup2.png',
    alt: 'VisionUp profile switching preview placeholder',
    caption: 'Preview 2',
  },
  {
    src: '/visionup3.png',
    alt: 'VisionUp screen visibility preview placeholder',
    caption: 'Preview 3',
  },
]

export const downloadInfo = {
  href: '#',
  label: 'Download for macOS',
  meta: ['Version 0.1', 'macOS', 'Apple Silicon', 'DMG'],
}
