import { renderHook, act } from '@testing-library/react';
import { useGetGames } from './useGetGames';
import * as swr from 'swr/infinite';
import { mockGames } from '@/test/mocks';

// Mock gameService
jest.mock('@/services/gameService', () => ({
  gameService: {
    getGames: jest.fn(),
  },
}));

// Mock SWR
jest.mock('swr/infinite', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockGame = mockGames[0];

const mockResponse = {
  games: [mockGame],
  availableFilters: ['Action', 'RPG'],
  totalPages: 2,
  currentPage: 1,
};

describe('useGetGames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial loading state', () => {
    (swr.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isLoading: true,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.games).toEqual([]);
    expect(result.current.filters).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it('should handle successful data fetching', () => {
    (swr.default as jest.Mock).mockReturnValue({
      data: [mockResponse],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.games).toEqual([mockGame]);
    expect(result.current.filters).toEqual(['Action', 'RPG']);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch');
    (swr.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      size: 1,
      setSize: jest.fn(),
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames());

    expect(result.current.error).toBe(mockError);
    expect(result.current.games).toEqual([]);
  });

  it('should not load more when reaching end', () => {
    const mockSetSize = jest.fn();
    (swr.default as jest.Mock).mockReturnValue({
      data: [{ ...mockResponse, games: Array(6).fill(mockGame) }],
      error: undefined,
      size: 1,
      setSize: mockSetSize,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames());

    act(() => {
      result.current.loadMore();
    });

    expect(mockSetSize).not.toHaveBeenCalled();
    expect(result.current.isReachingEnd).toBe(true);
  });

  it('should handle retry functionality', () => {
    const mockMutate = jest.fn();
    (swr.default as jest.Mock).mockReturnValue({
      data: [mockResponse],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useGetGames());

    act(() => {
      result.current.retry();
    });

    expect(mockMutate).toHaveBeenCalled();
  });

  it('should handle genre filtering', () => {
    const mockSetSize = jest.fn();
    (swr.default as jest.Mock).mockReturnValue({
      data: [mockResponse],
      error: undefined,
      size: 1,
      setSize: mockSetSize,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames({ genre: 'Action' }));

    expect(result.current.games).toEqual([mockGame]);
    expect(result.current.filters).toEqual(['Action', 'RPG']);
  });

  it('should handle loading more state', () => {
    (swr.default as jest.Mock).mockReturnValue({
      data: [mockResponse],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isLoading: false,
      isValidating: true,
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useGetGames());

    expect(result.current.isLoadingMore).toBe(true);
  });

  describe('getKey function', () => {
    it('should return correct query string without genre', () => {
      (swr.default as jest.Mock).mockImplementation(getKey => {
        const queryString = getKey(0);
        expect(queryString).toBe('page=1');
        return {
          data: undefined,
          error: undefined,
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames());
    });

    it('should return correct query string with genre', () => {
      (swr.default as jest.Mock).mockImplementation(getKey => {
        const queryString = getKey(0);
        expect(queryString).toBe('genre=Action&page=1');
        return {
          data: undefined,
          error: undefined,
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames({ genre: 'Action' }));
    });

    it('should handle different page indexes', () => {
      (swr.default as jest.Mock).mockImplementation(getKey => {
        const queryString = getKey(2);
        expect(queryString).toBe('page=3');
        return {
          data: undefined,
          error: undefined,
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames());
    });
  });

  describe('queryString fetcher function', () => {
    it('should call gameService.getGames with correct parameters', async () => {
      const mockGetGames = jest.fn().mockResolvedValue(mockResponse);
      jest
        .spyOn(require('@/services/gameService').gameService, 'getGames')
        .mockImplementation(mockGetGames);

      (swr.default as jest.Mock).mockImplementation((_, fetcher) => {
        // Test the fetcher function
        fetcher('genre=Action&page=1');

        return {
          data: [mockResponse],
          error: undefined,
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames({ genre: 'Action' }));

      expect(mockGetGames).toHaveBeenCalledWith('Action', 1);
    });

    it('should handle undefined genre parameter correctly', async () => {
      const mockGetGames = jest.fn().mockResolvedValue(mockResponse);
      jest
        .spyOn(require('@/services/gameService').gameService, 'getGames')
        .mockImplementation(mockGetGames);

      (swr.default as jest.Mock).mockImplementation((_, fetcher) => {
        // Test the fetcher function
        fetcher('page=1');

        return {
          data: [mockResponse],
          error: undefined,
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames());

      expect(mockGetGames).toHaveBeenCalledWith(undefined, 1);
    });

    it('should throw error when gameService.getGames fails', async () => {
      const mockError = new Error('API Error');
      const mockGetGames = jest.fn().mockRejectedValue(mockError);
      jest
        .spyOn(require('@/services/gameService').gameService, 'getGames')
        .mockImplementation(mockGetGames);

      (swr.default as jest.Mock).mockImplementation((_, fetcher) => {
        // Test the fetcher function
        expect(fetcher('page=1')).rejects.toThrow('Failed to load games. Please try again later.');

        return {
          data: undefined,
          error: new Error('Failed to load games. Please try again later.'),
          size: 1,
          setSize: jest.fn(),
          isLoading: false,
          isValidating: false,
          mutate: jest.fn(),
        };
      });

      renderHook(() => useGetGames());
    });
  });
});
