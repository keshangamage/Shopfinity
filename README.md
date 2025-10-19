# Shopfinity

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=20232a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff?style=flat&logo=vite&logoColor=fff)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Modern e-commerce platform delivering a performant, mobile-first shopping experience for consumers and administrative tooling for store operators.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture Highlights](#architecture-highlights)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Quality Gates](#quality-gates)
- [Contributing](#contributing)
- [License](#license)

## Overview

Shopfinity is built with React 19 and Vite to provide a smooth, app-like experience for shoppers. The platform includes rich product discovery, robust cart and checkout flows, and an administrative portal for merchandising, order oversight, and analytics.

## Key Features

- Multi-category catalogue with deep product detail pages and media galleries
- Real-time cart management, checkout workflow, and payment orchestration integrations
- Authenticated user accounts with profile management, saved items, and order history
- Admin dashboards for inventory oversight, order tracking, and customer insights
- Responsive layout with motion-enhanced interactions and Tailwind-based design system
- Full-text product search and category filtering backed by persistent local state

## Technology Stack

- **Frontend**: React 19, React Router, React Hooks
- **Tooling**: Vite, ESBuild, ESLint, Tailwind CSS
- **Data & Auth**: Firebase Authentication, Firestore (via Firebase SDK)
- **Visualization**: Chart.js with React bindings for analytics modules
- **State Management**: Context providers for auth, cart, payment, rewards, and admin data

## Architecture Highlights

- Modular component structure under `src/components` and `src/pages` to isolate layout, feature, and admin views
- Context-driven data layer in `src/utils` for cross-cutting concerns such as authentication, cart persistence, and reward programs
- Tailwind CSS configuration with utility-first styling and responsive breakpoints defined in `tailwind.config.js`
- Vite build pipeline optimized for fast local iteration and production bundling
- Deployment-ready configuration for Vercel via `vercel.json`

## Getting Started

### Prerequisites

- Node.js 18.0 or later (LTS recommended)
- npm 9+ (bundled with Node) or Yarn 1.22+

### Installation

```bash
git clone https://github.com/keshangamage/shopfinity.git
cd shopfinity
npm install
```

### Run Locally

```bash
npm run dev
```

The app defaults to `http://localhost:5173`. Press `Ctrl+C` in the terminal to stop the dev server.

## Environment Configuration

Create a `.env` file in the project root and provide Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Refer to the Firebase console for the correct values. Never commit secrets to version control.

## Project Structure

```
shopfinity/
├── public/             Static assets served as-is
├── src/
│   ├── assets/         Images and media
│   ├── components/     Reusable UI primitives and layouts
│   ├── pages/          Route-driven views for shoppers and admins
│   ├── styles/         Tailwind extensions and global stylesheets
│   ├── utils/          Context providers, helpers, and integrations
│   ├── App.jsx         Route configuration and layout switcher
│   └── main.jsx        Application entry point
├── index.html          HTML shell loaded by Vite
├── package.json        Scripts, dependencies, and metadata
└── vite.config.js      Build and dev-server configuration
```

## Available Scripts

- `npm run dev` launches the Vite development server
- `npm run build` generates an optimized production bundle
- `npm run preview` serves the production bundle locally for smoke testing
- `npm run lint` runs ESLint across the project source

## Quality Gates

- **Static Analysis**: Execute `npm run lint` before opening a pull request to catch common issues early
- **Manual QA**: Validate responsive layouts (mobile, tablet, desktop) and core shopper flows (browse, add to cart, checkout)
- **Deployment**: The repository includes `vercel.json` for zero-config Vercel deployments; ensure environment variables are set in the target environment

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/amazing-improvement`
2. Commit your changes with clear messages and run `npm run lint`
3. Submit a pull request describing the motivation, changes, and validation steps

For major changes, please open an issue first to discuss what you would like to improve.

## License

Distributed under the MIT License. See the `LICENSE` file for details.
