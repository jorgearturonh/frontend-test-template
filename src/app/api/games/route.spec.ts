import { mockGames } from '@/test/mocks';
import { GET } from './route';
import { Game } from '@/types';

// Mock the delay function to avoid actual delays in tests
jest.mock('@/utils/endpoint', () => ({
  allGames: mockGames as Game[],
  availableFilters: ['Action', 'RPG'],
  delay: () => Promise.resolve(),
}));

describe('Games API Route', () => {
  it('returns all games when no genre filter is applied', async () => {
    const request = new Request('http://localhost:3000/api/games?page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(3);
    expect(data.totalPages).toBe(1);
    expect(data.currentPage).toBe(1);
    expect(data.availableFilters).toEqual(['Action', 'RPG']);
  });

  it('filters games by genre', async () => {
    const request = new Request('http://localhost:3000/api/games?genre=Action&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(2);
    expect(data.games.every((game: Game) => game.genre === 'Action')).toBe(true);
    expect(data.totalPages).toBe(1);
    expect(data.currentPage).toBe(1);
  });

  it('handles invalid page numbers by defaulting to page 1', async () => {
    const request = new Request('http://localhost:3000/api/games?page=-1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.currentPage).toBe(1);
  });

  it('includes correct cache headers in response', async () => {
    const request = new Request('http://localhost:3000/api/games');
    const response = await GET(request);

    expect(response.headers.get('Cache-Control')).toBe('s-maxage=60, stale-while-revalidate');
  });

  it('performs case-insensitive genre filtering', async () => {
    const request = new Request('http://localhost:3000/api/games?genre=action');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(2);
    expect(data.games.every((game: Game) => game.genre.toLowerCase() === 'action')).toBe(true);
  });
});
