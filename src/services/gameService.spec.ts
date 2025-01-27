import { gameService } from './gameService';
import { env } from '@/config/env';

describe('gameService', () => {
  describe('getCacheKey', () => {
    it('should generate cache key with genre and page', () => {
      const key = gameService.getCacheKey('Action', 2);
      expect(key).toBe('games-Action-2');
    });

    it('should generate cache key with only page', () => {
      const key = gameService.getCacheKey(undefined, 2);
      expect(key).toBe('games-all-2');
    });

    it('should generate default cache key when no parameters provided', () => {
      const key = gameService.getCacheKey();
      expect(key).toBe('games-all-1');
    });
  });

  describe('getGames', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should fetch games with genre and page', async () => {
      const mockResponse = {
        games: [],
        availableFilters: [],
        totalPages: 1,
        currentPage: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await gameService.getGames('Action', 2);

      expect(global.fetch).toHaveBeenCalledWith(
        `${env.apiUrl}/games?genre=Action&page=2`,
        expect.objectContaining({
          next: { revalidate: 60 },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch games with default parameters', async () => {
      const mockResponse = {
        games: [],
        availableFilters: [],
        totalPages: 1,
        currentPage: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await gameService.getGames();

      expect(global.fetch).toHaveBeenCalledWith(
        `${env.apiUrl}/games?page=1`,
        expect.objectContaining({
          next: { revalidate: 60 },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(gameService.getGames()).rejects.toThrow('Failed to fetch games');
    });

    it('should throw error when network request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(gameService.getGames()).rejects.toThrow('Network error');
    });
  });
});
