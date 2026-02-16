# FloodSense

FloodSense is a comprehensive flood monitoring and alert system designed to help communities stay informed and safe during flood events. It combines real-time data, interactive maps, and community reporting to provide actionable insights.

## Features

- **Real-Time Monitoring**: Track water levels and river discharge rates.
- **Interactive Maps**: Visualize flood-prone zones and current water levels on a dynamic map.
- **Alert System**: Receive timely warnings and alerts about potential flood risks.
- **Community Reporting**: Users can report incidents and local conditions to help others.
- **Weather Integration**: Integrated weather forecasts to anticipate rainfall and storm patterns.
- **District Resources**: Access critical information and resources for specific districts.
- **Admin Dashboard**: Centralized control panel for managing alerts, reports, and system data.

## Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (installed)
- [MongoDB](https://www.mongodb.com/) (local or Atlas instance)


## Project Structure

```
FloodSense/
├── backend/                # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Entry point
│   └── ...
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── types/          # TypeScript definitions
│   │   └── App.tsx         # Main application component
│   └── ...
└── ...
```
## Deployment Link - https://floodsense23.vercel.app , https://floodsense23.vercel.app/admin/login
## Admin credentials - Name- admin, Password-admin123

