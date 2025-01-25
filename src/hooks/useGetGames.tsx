import useSWRInfinite from 'swr/infinite';
import { Game } from '@/types';
import { gameService } from '@/services/gameService';
import { ITEMS_PER_PAGE } from '@/config/consts';

interface UseGetGamesProps {
  genre?: string;
  page?: number;
}

interface UseGetGamesReturn {
  games: Game[];
  filters: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  loadMore: () => void;
  isReachingEnd: boolean;
  retry: () => void;
}

export const useGetGames = ({ genre, page = 1 }: UseGetGamesProps = {}): UseGetGamesReturn => {
  const getKey = (pageIndex: number) => {
    const queryParams = new URLSearchParams();
    if (genre) queryParams.append('genre', genre);
    queryParams.append('page', (pageIndex + 1).toString());
    return queryParams.toString();
  };

  const {
    data,
    error,
    size,
    setSize,
    isLoading: initialLoading,
    isValidating,
    mutate,
  } = useSWRInfinite(
    getKey,
    async queryString => {
      try {
        const response = await gameService.getGames(
          new URLSearchParams(queryString).get('genre') || undefined,
          Number(new URLSearchParams(queryString).get('page')) || 1
        );
        return response;
      } catch (error) {
        throw new Error('Failed to load games. Please try again later.');
      }
    },
    {
      revalidateFirstPage: false,
      revalidateAll: false,
      initialSize: page,
      persistSize: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      shouldRetryOnError: false,
    }
  );

  const isLoadingMore = isValidating;
  const isReachingEnd = data ? data[data.length - 1]?.games.length < ITEMS_PER_PAGE : false;

  const games = data ? data.flatMap(pageData => pageData.games) : [];
  const filters = data?.[0]?.availableFilters ?? [];
  const totalPages = data?.[0]?.totalPages ?? 0;
  const currentPage = data ? data[data.length - 1]?.currentPage : page;

  const loadMore = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  };

  const retry = () => {
    mutate();
  };

  return {
    games,
    filters,
    isLoading: initialLoading,
    isLoadingMore: isValidating,
    error,
    totalPages,
    currentPage,
    loadMore,
    isReachingEnd,
    retry,
  };
};
