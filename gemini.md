# Shuddhota Co. — Pure Spices & Premium Dry Foods

This project is a modern e-commerce application for Shuddhota Co., specializing in authentic masalas and premium dry foods.

## Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Fonts**: Plus Jakarta Sans (Google Fonts)

## Project Structure
- `src/app/`: Core application logic, layouts, and page-level components.
- `src/app/products/`: The converted Products page with full filtering and search logic.
- `src/components/`: Reusable UI components (e.g., Navbar, Footer).
- `HTML/`: Original static HTML mockups for reference.
- `public/`: Static assets like images and fonts.

## Development Workflow

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Corrupted Build Cache
If you encounter `MODULE_NOT_FOUND` errors for random `.js` files in the `.next` directory, it usually means the build cache is corrupted. 
**Fix:** Delete the `.next` folder and restart the server.
```bash
rm -rf .next
npm run dev
```

### Missing Dependencies
If you see errors related to `autoprefixer` or other styling tools, ensure all dev dependencies are installed:
```bash
npm install
```

## Core Principles
- **Clean Architecture**: Separation of concerns between UI components and business logic.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Type Safety**: Rigorous use of TypeScript for all components and utilities.
