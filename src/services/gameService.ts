import { Game } from '@/types';
import { env } from '@/config/env';

export interface GamesResponse {
  games: Game[];
  availableFilters: string[];
  totalPages: number;
  currentPage: number;
}

export const gameService = {
  getCacheKey(genre?: string, page: number = 1): string {
    return `games-${genre || 'all'}-${page}`;
  },

  async getGames(genre?: string, page: number = 1): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();
    if (genre) queryParams.append('genre', genre);
    queryParams.append('page', page.toString());

    const response = await fetch(`${env.apiUrl}/games?${queryParams.toString()}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    return response.json();
  },
};
