# Narcoguard Developer Documentation

This document provides detailed information for developers working on the Narcoguard project. It covers architecture, code organization, best practices, and development workflows.

## Architecture Overview

Narcoguard follows a modern React architecture using Next.js with the App Router. The application is structured as follows:

### Frontend Architecture

\`\`\`mermaid
graph TD
    A[App Entry] --> B[Layouts]
    B --> C[Pages]
    C --> D[Components]
    D --> E[UI Components]
    D --> F[Feature Components]
    B --> G[Context Providers]
    G --> H[Theme Provider]
    G --> I[Auth Provider]
    G --> J[Feature Flags]
\`\`\`

### Data Flow

\`\`\`mermaid
graph LR
    A[User Interaction] --> B[React Components]
    B --> C[Server Actions/API Routes]
    C --> D[External Services]
    D --> C
    C --> B
    B --> A
\`\`\`

## Code Organization

### Directory Structure

- `app/`: Next.js App Router pages and layouts
  - `api/`: API routes
  - `components/`: App-specific components
  - `dashboard/`, `download/`, etc.: Route groups
- `components/`: Shared components
  - `ui/`: UI components (shadcn/ui)
- `lib/`: Utility functions and services
- `public/`: Static assets
- `scripts/`: Build and setup scripts

### Key Files

- `app/layout.tsx`: Root layout with providers
- `app/page.tsx`: Homepage
- `app/globals.css`: Global styles
- `middleware.ts`: Request middleware
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration

## Development Workflow

### Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev`

### Development Guidelines

#### Code Style

- Follow the ESLint and Prettier configurations
- Use TypeScript for type safety
- Follow the component naming conventions:
  - PascalCase for React components
  - camelCase for functions and variables
  - kebab-case for file names

#### Component Structure

\`\`\`tsx
// Import statements
import { useState } from 'react'
import { ComponentProps } from './types'

// Component definition
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // State and hooks
  const [state, setState] = useState(initialState)

  // Event handlers
  const handleEvent = () => {
    // Logic
  }

  // Helper functions
  const helperFunction = () => {
    // Logic
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
\`\`\`

#### State Management

- Use React's built-in state management (useState, useReducer) for component-level state
- Use React Context for global state
- Consider using Server Components and Server Actions for data fetching and mutations

#### Performance Optimization

- Use Server Components where possible
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use memoization for expensive calculations
- Implement virtualization for long lists
- Use debounce and throttle for frequent events

#### Accessibility

- Follow WCAG 2.1 AA standards
- Use semantic HTML elements
- Implement keyboard navigation
- Ensure proper color contrast
- Add ARIA attributes where necessary
- Test with screen readers

## Testing

### Unit Testing

- Use Jest for unit tests
- Test components with React Testing Library
- Run tests with `npm test`

### Integration Testing

- Use Cypress for integration tests
- Run tests with `npm run test:integration`

### End-to-End Testing

- Use Playwright for E2E tests
- Run tests with `npm run test:e2e`

## Deployment

### Staging

- Automatic deployment to staging environment on push to `develop` branch
- URL: https://staging.narcoguard.com

### Production

- Automatic deployment to production environment on push to `main` branch
- URL: https://narcoguard.com

### Environment Variables

- Development: `.env.local`
- Staging: Vercel environment variables
- Production: Vercel environment variables

## Performance Monitoring

- Use Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Set up alerts for performance regressions

## Security

- Follow OWASP Top 10 guidelines
- Implement Content Security Policy
- Use HTTPS for all environments
- Sanitize user inputs
- Implement rate limiting
- Use secure authentication flows

## Troubleshooting

### Common Issues

#### Hydration Errors

Hydration errors occur when the server-rendered HTML doesn't match the client-rendered HTML. Common causes:

- Using browser-only APIs in Server Components
- Different content based on environment variables
- Random values or dates

Solution: Move browser-only code to Client Components and ensure consistent rendering.

#### API Route Errors

- Check environment variables
- Verify API endpoint URLs
- Check authentication tokens
- Inspect network requests in browser dev tools

## Contributing

1. Create a feature branch from `develop`
2. Make changes and commit with conventional commit messages
3. Push branch and create a pull request
4. Ensure CI passes
5. Request review from team members
6. Merge to `develop` after approval

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
\`\`\`

Now, let's create a performance monitoring utility:
