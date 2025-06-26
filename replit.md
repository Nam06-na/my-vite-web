# Professional Digital Journey - Project Overview

## Overview

This project is a professional digital journal application built as a full-stack web application. It allows users to create, view, and manage professional memories, achievements, and career milestones in a timeline format. The application is designed to help professionals showcase their growth and development over time, making it suitable for sharing with employers or for personal reflection.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React-based SPA with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for data management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development across the entire frontend
- **Vite**: Fast development server and build tool
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation
- **shadcn/ui**: Accessible component library built on Radix UI primitives

### Backend Architecture
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe backend development
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Primary database (configured via Neon serverless)
- **Memory Storage**: Fallback storage implementation with seeded data

### Component Structure
- **Navigation**: Fixed header with branding and main actions
- **Timeline**: Central component displaying entries in chronological order
- **Entry Cards**: Individual entry display with category badges and metadata
- **Modal Forms**: Entry creation with validation and error handling
- **UI Components**: Comprehensive shadcn/ui component library integration

### Database Schema
- **Users Table**: User authentication (id, username, password)
- **Entries Table**: Journal entries (id, title, content, excerpt, category, date, createdAt)
- **Validation**: Zod schemas for type-safe data validation

## Data Flow

1. **Entry Creation**: Users create entries via modal form → validation → API endpoint → database storage
2. **Timeline Display**: Database entries → API fetch → React Query cache → Timeline component rendering
3. **Entry Detail**: Individual entry access via routing → API fetch → detailed view rendering
4. **Real-time Updates**: React Query automatically refetches and updates UI after mutations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, ESBuild
- **Backend**: Express.js, Node.js runtime
- **Database**: PostgreSQL, Drizzle ORM, Neon serverless driver

### UI/UX Dependencies
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Components**: Radix UI primitives, Lucide React icons
- **Fonts**: Google Fonts (Playfair Display, Open Sans)
- **Form Handling**: React Hook Form, Hookform Resolvers

### Development Dependencies
- **Type Safety**: TypeScript, Zod validation
- **State Management**: TanStack React Query
- **Development Tools**: Replit integration, runtime error overlay

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 on Replit
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite development server with HMR

### Production Build
- **Frontend Build**: Vite builds client code to `dist/public`
- **Backend Build**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Uses DATABASE_URL environment variable for connection

### Deployment Configuration
- **Target**: Autoscale deployment on Replit
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment**: Production NODE_ENV with optimized builds

## Changelog

```
Changelog:
- June 26, 2025. Initial setup - Created basic journal website with timeline layout
- June 26, 2025. Added image upload functionality for entries
- June 26, 2025. Implemented removable timeline feature with delete buttons
- June 26, 2025. Fixed navigation component and entry display with image support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```