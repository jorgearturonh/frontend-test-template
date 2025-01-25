import { http, HttpResponse } from 'msw';
import { allGames, availableFilters, delay } from '@/utils/endpoint';
import { ITEMS_PER_PAGE } from '@/config/consts';
import { GamesResponse } from '@/services/gameService';

export const getGamesWithCustomResponseOnce = (override: Partial<GamesResponse>) =>
  http.get('/api/games', () => HttpResponse.json({ ...override }), {
    once: true,
  });

export const emulateLoading = () =>
  http.get(
    '/api/games',
    async () => {
      +console.log('emaulate loading');
      await delay(5000000);
      return HttpResponse.json({});
    },
    {
      once: true,
    }
  );

export const handlers = [
  http.get('/api/games', async ({ request }) => {
    const url = new URL(request.url, 'http://localhost');
    const genre = url.searchParams.get('genre');
    let page = parseInt(url.searchParams.get('page') ?? '1');

    // Filter games first
    let filteredGames = genre
      ? allGames.filter(game => game.genre.toLowerCase() === genre.toLowerCase())
      : allGames;

    // Calculate total pages based on filtered games
    const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

    if (page < 1 || isNaN(page)) page = 1;

    // Paginate after filtering
    const fromIndex = (page - 1) * ITEMS_PER_PAGE;
    const toIndex = page * ITEMS_PER_PAGE;
    const games = filteredGames.slice(fromIndex, toIndex);

    return HttpResponse.json({
      games,
      availableFilters,
      totalPages,
      currentPage: page,
    });
  }),
];
