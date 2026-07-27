# Sikshya Web

Sikshya Web is the frontend experience for a modern tutoring and learning marketplace designed to connect students with qualified tutors in a simple, intuitive, and responsive way. The platform focuses on making academic support accessible through role-based dashboards, booking flows, messaging, and learning-focused interfaces.

Repository: https://github.com/sasss77/sikshya-web.git

## Table of Contents

- [Overview](#overview)
- [What This Project Does](#what-this-project-does)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Linting](#linting)
- [Contributing](#contributing)

## Overview

Sikshya is built to support a complete online tutoring ecosystem. Students can discover tutors, explore learning opportunities, manage bookings, and communicate with instructors, while tutors and administrators can access dedicated interfaces for managing their responsibilities efficiently.

This project is a Next.js-based frontend that provides a polished user interface for the broader Sikshya platform and works alongside a backend API for real data, authentication, and communication features.

## What This Project Does

The application provides a seamless experience for the following user journeys:

- Students can browse tutor profiles, view ratings, and find subjects that match their academic needs.
- Users can sign up, log in, and access personalized dashboards based on their role.
- Tutors can manage their profiles, learning content, and booking-related activities.
- Admin users can oversee platform activity and monitor system data.
- The app includes real-time chat and notification capabilities to support ongoing communication between users.

## Core Features

- Role-based access for students, tutors, and admins
- Tutor discovery and profile exploration
- Session booking and learning management
- Messaging and notification support
- Course and learning content views
- Google OAuth login integration
- Responsive design optimized for multiple screen sizes
- Admin dashboard for monitoring users and platform activity

## Technology Stack

The frontend is built with a modern JavaScript and React ecosystem:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Socket.IO client
- React Hook Form + Zod
- Axios
- Lucide React

## Project Structure

The repository is organized into the following main areas:

- app/ - main route-based pages and layouts
- app/_components/ - reusable UI components such as headers, chat, and modals
- app/_views/ - view-level components for landing and page-specific experience
- lib/ - actions, API helpers, authentication utilities, and shared context
- public/ - static assets and public files

## Prerequisites

Before starting, make sure your development environment includes:

- Node.js 18 or newer
- npm or pnpm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sasss77/sikshya-web.git
cd sikshya-web
```

2. Install the required packages:

```bash
npm install
```

## Environment Configuration

Create a file named .env.local in the project root and add the values below:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

These variables are used for API calls, backend communication, and authentication-related features.

## Running the Application

Start the development server with:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Building for Production

To create a production build:

```bash
npm run build
npm run start
```

## Linting

Run the linter with:

```bash
npm run lint
```

## Contributing

Contributions are welcome. If you would like to help improve the project, please follow this workflow:

1. Fork the repository
2. Create a feature or bugfix branch
3. Make your changes
4. Commit and push your work
5. Open a pull request

