# CLAUDE.md - Project Guide

## Project Overview
This is a modern React application built with Vite, TypeScript, and TailwindCSS. It uses React Router v7 in framework configuration mode.

## Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run serve            # Preview production build

# Development Tools
npm run biome:check      # Check code with Biome
npm run biome:fix        # Fix linting issues
npm run type:check       # Run TypeScript type checking
npm run check:turbo      # Run linting, type checking, and tests in parallel

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate test coverage

# Maintenance
npm run up-interactive   # Interactive dependency updates
npm run knip             # Find unused dependencies
```

## Tech Stack & Architecture

### Core Technologies
- **React 19** with TypeScript
- **Vite 6** for build tooling
- **TailwindCSS 4** for styling
- **React Router 7** for routing
- **Vitest** for testing
- **Biome** for linting/formatting

### Project Structure
- `/src` - Main source code
  - `/lib` - Core application logic
    - `/components` - Reusable UI components
    - `/layout` - Page layout components
    - `/pages` - Page components by route
    - `/styles` - Global CSS and styles
    - `/utils` - Helper utilities
  - `root.tsx` - Root component with app providers
  - `routes.ts` - Application routes

### Features
- Dark/light theme toggle with next-themes
- TypeScript path aliases (@/* for src directory)
- TailwindCSS with typography plugin
- Conventional commits with commitlint
- Git hooks with Husky and lint-staged
- Bundle visualization with rollup-plugin-visualizer
- PWA support with vite-plugin-pwa

## Deployment
- Build command: `npm run build`
- Output directory: `build/client`
- Ready to deploy on Vercel or Netlify (configuration included)