# Boutique Web

React + Vite website for Sapphire & Sage boutique. Matches the mobile app design with elegant, warm color scheme.

## Features

- **Home**: Hero banner and featured products
- **Product Detail**: Full product view with add-to-cart
- **Cart**: Manage cart items and quantities
- **Checkout**: Secure order placement
- **Orders**: View order history
- **Profile**: User account management
- **Auth**: Login and registration

## Tech Stack

- React 18
- Vite
- React Router
- Zustand (state management)
- Axios

## Color Scheme

- Primary: `#3D3D3D` (Dark Brown)
- Secondary: `#8B7B6B` (Taupe)
- Accent: `#E8DFD5` (Beige)
- Background: `#faf8f6` (Cream)

## Getting Started

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

## API Configuration

API connects to backend at `http://10.0.0.67:3000/api` (set in `.env.local`)

## Build

```bash
npm run build
```

Production build in `dist/`
