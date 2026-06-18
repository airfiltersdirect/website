# AirFiltersDirect — Design Brainstorm

## Three Stylistic Approaches

### 1. Arctic Precision (probability: 0.07)
A clinical, ultra-clean Scandinavian-meets-tech aesthetic. Ice-white backgrounds, sharp edges, monochrome with a single electric-cyan accent. Feels like a medical device company — authoritative, sterile, trustworthy.

### 2. Clean Air Glassmorphism (probability: 0.08)
Bright, airy, sky-blue palette with frosted glass panels floating over a soft gradient sky background. Inspired by the feeling of breathing fresh air. Premium but approachable, modern but warm.

### 3. Industrial Precision (probability: 0.04)
Dark charcoal/steel backgrounds with amber and gold accents. Evokes HVAC engineering and industrial quality. Bold, masculine, technical.

---

## Chosen Approach: **Clean Air Glassmorphism** (probability: 0.08)

### Design Movement
**Glassmorphism + Atmospheric Minimalism** — frosted glass cards floating over luminous sky-gradient backgrounds, creating a sense of depth, cleanliness, and premium quality. Inspired by Apple's visionOS and modern SaaS landing pages.

### Core Principles
1. **Depth through glass** — every card, modal, and panel uses `backdrop-blur` + semi-transparent fills to create layered depth
2. **Sky-to-slate gradient world** — the entire page lives inside a rich sky-blue-to-slate-blue gradient atmosphere
3. **Restrained color** — only two accent colors (sky blue + a warm amber for CTAs), everything else is white/glass
4. **Purposeful motion** — elements float in on scroll, cards lift on hover, buttons pulse on interaction

### Color Philosophy
- **Background world**: `oklch(0.96 0.04 220)` → `oklch(0.88 0.06 230)` (bright sky to slate-blue gradient)
- **Glass panels**: `rgba(255,255,255,0.55)` with `backdrop-blur(20px)` and `border: 1px solid rgba(255,255,255,0.7)`
- **Primary accent**: `oklch(0.55 0.18 230)` — a rich, confident sky blue
- **CTA amber**: `oklch(0.72 0.18 65)` — warm amber for "Add to Cart" and primary actions
- **Text**: `oklch(0.18 0.02 230)` — deep slate, not pure black

### Layout Paradigm
Asymmetric hero with a large headline offset left and a floating product card right. Product grid uses a masonry-influenced responsive grid (3-col desktop, 2-col tablet, 1-col mobile). Checkout is a centered modal-style multi-step flow with a progress bar.

### Signature Elements
1. **Floating glass cards** — products, features, and testimonials all live in frosted glass panels
2. **Atmospheric gradient orbs** — soft radial gradient blobs in the background for depth
3. **Thin sky-blue rule lines** — used as section dividers and form field underlines

### Interaction Philosophy
Every interaction confirms the user's action immediately. Hover lifts cards with `translateY(-4px)` + deeper shadow. Add-to-cart triggers a micro-animation (icon flies to cart). Form fields glow sky-blue on focus.

### Animation
- Entrance: `opacity: 0 → 1` + `translateY(20px → 0)` over 400ms `cubic-bezier(0.23, 1, 0.32, 1)`
- Card hover: `translateY(-4px)` + `box-shadow` deepens, 200ms ease-out
- Button press: `scale(0.97)` 160ms ease-out
- Cart badge: bounce scale animation on item add
- Step transitions: slide left/right with fade, 300ms

### Typography System
- **Display/Headlines**: `Sora` — geometric, modern, slightly futuristic. Bold 700/800 weights.
- **Body/UI**: `DM Sans` — humanist, readable, friendly. 400/500 weights.
- **Hierarchy**: 72px hero → 40px section → 24px card title → 16px body → 13px caption

### Brand Essence
**AirFiltersDirect** — Premium furnace filters delivered direct to your door, for homeowners who care about air quality. *Clean. Direct. Trusted.*
Personality: **Trustworthy, Premium, Effortless**

### Brand Voice
Headlines are clear and confident, never salesy. CTAs are direct and action-oriented.
- Example headline: *"Breathe Better. Filter Smarter."*
- Example CTA: *"Shop Filters Now"* / *"Add to Cart"*
No filler like "Welcome to our website."

### Wordmark & Logo
A stylized air-flow symbol — two curved parallel lines suggesting airflow through a filter mesh, forming an abstract "A" shape. Clean, geometric, memorable.

### Signature Brand Color
`oklch(0.55 0.18 230)` — a rich, confident sky blue. Unmistakably AirFiltersDirect.
