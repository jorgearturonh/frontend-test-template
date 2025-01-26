import { allGames, availableFilters, delay } from '@/utils/endpoint';
import { ITEMS_PER_PAGE } from '@/config/consts';

const API_DELAY_MS = 330;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');
  let page = parseInt(searchParams.get('page') ?? '1');

  // Filter games first
  let filteredGames = genre
    ? allGames.filter(game => game.genre.toLowerCase() === genre.toLowerCase())
    : allGames;

  // Calculate total pages based on filtered games
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  if (page < 1 || isNaN(page)) page = 1;

  // Mock delay
  await delay(API_DELAY_MS);

  // Paginate after filtering
  const fromIndex = (page - 1) * ITEMS_PER_PAGE;
  const toIndex = page * ITEMS_PER_PAGE;
  const games = filteredGames.slice(fromIndex, toIndex);

  // Add cache headers
  const headers = new Headers();
  headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');

  return new Response(
    JSON.stringify({
      games,
      availableFilters,
      totalPages,
      currentPage: page,
    }),
    { headers }
  );
}
