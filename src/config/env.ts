export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
} as const;

// Validate environment variables
if (!env.apiUrl) {
  throw new Error('API_URL environment variable is not defined');
}
