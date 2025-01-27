# Game Shop

A responsive web application built with Next.js for browsing and purchasing games. This project demonstrates modern frontend development practices using React, TypeScript, and TailwindCSS.

## 🚀 Features

- Responsive game catalog with filtering
- Shopping cart functionality with local storage persistence
- Checkout process with multiple payment methods
- Unit testing with Jest and React Testing Library
- Modern UI with TailwindCSS
- Server-side and client-side rendering with Next.js

## 🛠 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: SWR
- **Testing**: Jest & React Testing Library
- **Animations**: Framer Motion
- **Code Quality**: ESLint, Prettier
- **Node Version**: v20.11.1

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/jorgearturonh/frontend-test-template.git
cd frontend-test-template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## 🔧 Environment Variables

The following environment variables are required:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📝 Available Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## 🧪 Testing

The project uses Jest and React Testing Library for testing. Tests are located next to their corresponding components with the `.spec.tsx` or `.spec.ts` extension.

Run tests:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## 📐 Code Quality

- ESLint is configured with Next.js recommended rules
- Prettier is set up for consistent code formatting
- Git hooks (optional) can be added for pre-commit formatting
- Coverage thresholds are set to maintain code quality:
  - Branches: 95%
  - Functions: 88%
  - Lines: 99%
  - Statements: 99%

## 🎨 Styling

The project uses TailwindCSS with custom configuration for:

- Custom font sizes
- Custom colors
- Custom animations
- Responsive design utilities

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── config/          # Configuration files
├── hooks/           # Custom React hooks
├── services/        # API and business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── test/            # Test utilities and mocks
```

## 🌐 API Routes

The application includes a local API with the following endpoint:

- `GET /api/games` - Fetch games with optional filters:
  - `genre`: Filter by game genre
  - `page`: Pagination parameter

## 🚀 Deployment

The application can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## 📄 License

This project is licensed under the MIT License.
