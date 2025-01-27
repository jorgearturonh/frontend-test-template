import { env } from './env';

describe('env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default API URL when environment variable is not set', () => {
    expect(env.apiUrl).toBe('http://localhost:3000/api');
  });

  it('should use environment variable value when NEXT_PUBLIC_API_URL is set', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    const { env: updatedEnv } = require('./env');
    expect(updatedEnv.apiUrl).toBe('https://api.example.com');
  });
});
