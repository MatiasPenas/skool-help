# NICEVERY.NICE - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | Astro 4.x |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Font | Inter (system fallback) |

## 2. Tailwind Configuration

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#141414',
        'card-hover': '#1a1a1a',
        elevated: '#1f1f1f',
        border: '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-muted': '#666666',
        accent: {
          yellow: '#f5c518',
          purple: '#7c3aed',
          green: '#22c55e',
          pink: '#ec4899',
          blue: '#3b82f6',
          orange: '#f97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '6px',
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    }
  }
}
```

## 3. Component Inventory

### Shadcn/UI Components (to install)
- `button` - For GET buttons and CTAs
- `card` - Base card component
- `badge` - For category labels
- `separator` - For dividers

### Custom Components

#### Layout Components
| Component | Props | Description |
|-----------|-------|-------------|
| `Header` | - | Fixed navigation header |
| `Footer` | - | Site footer with links |
| `Container` | `children`, `class` | Max-width wrapper |

#### Section Components
| Component | Props | Description |
|-----------|-------|-------------|
| `HeroSection` | - | Hero with title and subtitle |
| `EmailTemplatesSection` | - | Responsive email cards grid |
| `ToolsSection` | `title`, `link`, `tools[]` | Tool list section |
| `ShowcaseSection` | `title`, `link`, `items[]` | Article showcase cards |
| `ResourceCardsSection` | `title`, `link`, `cards[]` | Image card grid |
| `CaseStudiesSection` | `title`, `link`, `cases[]` | Case study cards |

#### Card Components
| Component | Props | Description |
|-----------|-------|-------------|
| `EmailTemplateCard` | `image`, `title`, `subtitle`, `price`, `color` | Colored email card |
| `ToolItem` | `icon`, `name`, `description` | Tool list item |
| `ShowcaseCard` | `category`, `title`, `thumbnail` | Horizontal article card |
| `ResourceCard` | `image`, `icon`, `title`, `description`, `price` | Vertical product card |
| `CaseStudyCard` | `category`, `title`, `thumbnail` | Case study card |

#### Animation Components
| Component | Props | Description |
|-----------|-------|-------------|
| `FadeIn` | `children`, `delay`, `duration` | Fade in wrapper |
| `SlideUp` | `children`, `delay` | Slide up animation |
| `StaggerContainer` | `children`, `staggerDelay` | Stagger children |

## 4. Animation Implementation Plan

| Interaction | Tech | Implementation |
|-------------|------|----------------|
| Page Load Fade | Framer Motion | `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}` |
| Hero Entrance | Framer Motion | `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, duration 0.5s |
| Section Scroll Reveal | Framer Motion | `whileInView` with `viewport={{ once: true }}` |
| Card Stagger | Framer Motion | `staggerChildren: 0.1` in parent variants |
| Card Hover Lift | Tailwind + FM | `whileHover={{ y: -4 }}`, `transition={{ duration: 0.2 }}` |
| Button Hover | Tailwind | `hover:bg-elevated transition-colors duration-150` |
| Image Zoom | Tailwind | `group-hover:scale-105 transition-transform duration-300` |
| Link Arrow | Tailwind | `group-hover:translate-x-1 transition-transform` |

### Animation Timing Constants
```typescript
const ANIMATION = {
  duration: {
    fast: 0.15,
    normal: 0.2,
    slow: 0.4,
    reveal: 0.6,
  },
  ease: {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.34, 1.56, 0.64, 1],
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  }
}
```

## 5. Project File Structure

```
/mnt/okcomputer/output/app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Container.astro
│   │   ├── cards/
│   │   │   ├── EmailTemplateCard.astro
│   │   │   ├── ToolItem.astro
│   │   │   ├── ShowcaseCard.astro
│   │   │   ├── ResourceCard.astro
│   │   │   └── CaseStudyCard.astro
│   │   └── animations/
│   │       ├── FadeIn.astro
│   │       └── StaggerContainer.astro
│   ├── sections/
│   │   ├── HeroSection.astro
│   │   ├── EmailTemplatesSection.astro
│   │   ├── ToolsSection.astro
│   │   ├── ShowcaseSection.astro
│   │   ├── ResourceCardsSection.astro
│   │   └── CaseStudiesSection.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       └── utils.ts
├── public/
│   ├── assets/              # Extracted images
│   └── favicon.svg
├── tailwind.config.js
├── astro.config.mjs
└── package.json
```

## 6. Package Installation

```bash
# Initialize project
bash scripts/init-webapp.sh "NICEVERY.NICE"

# Install shadcn components
cd /mnt/okcomputer/output/app
npx shadcn add button card badge separator

# Install animation library
npm install framer-motion

# Install icons
npm install lucide-react
```

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640-1024px | 2-column grids |
| Desktop | > 1024px | Full 3-column layouts |

## 8. Performance Considerations

- Use `will-change: transform` on animated elements
- Lazy load images below the fold
- Use `viewport={{ once: true }}` for scroll animations
- Implement `prefers-reduced-motion` media query support
- Optimize images with Astro's built-in optimization

## 9. Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance (WCAG AA)
- Reduced motion support
