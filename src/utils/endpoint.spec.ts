import { allGames, availableFilters, delay } from './endpoint';

describe('endpoint', () => {
  describe('allGames', () => {
    it('should contain the correct number of games', () => {
      expect(allGames).toHaveLength(30);
    });

    it('should have valid game objects', () => {
      allGames.forEach(game => {
        expect(game).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            genre: expect.any(String),
            image: expect.stringContaining('/game-images/'),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            isNew: expect.any(Boolean),
          })
        );
      });
    });

    it('should have unique game IDs', () => {
      const ids = allGames.map(game => game.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allGames.length);
    });
  });

  describe('availableFilters', () => {
    it('should contain unique genres from allGames', () => {
      const expectedGenres = Array.from(new Set(allGames.map(game => game.genre)));
      expect(availableFilters).toEqual(expectedGenres);
    });

    it('should not contain duplicate genres', () => {
      const uniqueFilters = new Set(availableFilters);
      expect(uniqueFilters.size).toBe(availableFilters.length);
    });
  });

  describe('delay', () => {
    it('should resolve after specified time', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(100);
    });

    it('should return a promise', () => {
      const result = delay(0);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle zero delay', async () => {
      await expect(delay(0)).resolves.toBeUndefined();
    });

    it('should handle negative delay', async () => {
      await expect(delay(-100)).resolves.toBeUndefined();
    });
  });
});
