# Portfolio - hridyachopra

A personal portfolio website for a UI/UX & brand designer, built with Next.js and featuring a unique vinyl disc project browser.

## ✨ Features

- **Interactive Vinyl Disc** - Scroll, drag, or swipe to browse projects on a rotating vinyl record
- **Custom Cursor** - Spring physics cursor with hover expansion
- **Dark/Light Mode** - Theme toggle with localStorage persistence
- **Smooth Animations** - Framer Motion scroll reveals and page transitions
- **Responsive Design** - Mobile-first approach with breakpoints
- **Case Study Templates** - Editorial-style project deep dives
- **Contact Form** - Functional form ready for backend integration

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Fonts:** Google Fonts (Playfair Display + Inter)
- **TypeScript:** Full type safety
- **Deployment:** Vercel

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Nav + Cursor
│   ├── page.tsx           # Home page
│   ├── work/              # Work page + case studies
│   ├── about/             # About page
│   └── contact/           # Contact form
├── components/            # React components
│   ├── Nav.tsx           # Navigation with theme toggle
│   ├── CustomCursor.tsx  # Custom cursor component
│   ├── Disc.tsx          # Vinyl disc interaction
│   └── ui/               # Design system components
├── public/               # Static assets
└── screenshot.mjs        # Automated screenshot script
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/choprahridya/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Tokens

The design uses CSS custom properties for easy theming:

- `--color-bg-primary` - Deep navy (#0D1B2A)
- `--color-text-primary` - Warm cream (#F0EBE0)
- `--color-accent-primary` - Gold (#C9A96E)

### Typography

- **Headings:** Playfair Display (serif)
- **Body/UI:** Inter (sans-serif)

### Components

Reusable components in `/components/ui/`:
- `PillTag` - Border-only labels
- `Button` - Animated buttons with variants
- `Heading` - Responsive headings (h1-h6)
- `RevealText` - Scroll reveal wrapper
- `PageTransition` - Page enter/exit animations

## 📸 Screenshots

Screenshots are available in `/public/`:
- `screenshot-home.png`
- `screenshot-work.png`
- `screenshot-about.png`
- `screenshot-contact.png`

Generate new screenshots:
```bash
node screenshot.mjs
```

## 🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Deploy with default settings

Or use Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

## 📄 License

This project is private and proprietary.

## 🤝 Credits

Built with [Claude Code](https://claude.com/claude-code)
