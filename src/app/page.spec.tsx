import React from 'react';
import { render, screen, fireEvent, within } from '@/utils/test-utils';
import Home from './page';
import { useGetGames } from '@/hooks/useGetGames';
import { useRouter } from 'next/navigation';
import { mockGames } from '@/test/mocks';

// Mock the useGetGames hook
jest.mock('@/hooks/useGetGames');

// Mock useRouter and useSearchParams from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams('')),
}));

// Mock React.Suspense
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="suspense-fallback">{children}</div>
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Add new test for successful Suspense resolution
  it('renders HomeContent', () => {
    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByText('Top Sellers')).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    (useGetGames as jest.Mock).mockReturnValue({
      games: [],
      filters: [],
      isLoading: true,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    expect(screen.getAllByTestId('game-card-skeleton')).toHaveLength(6);
  });

  it('renders games after loading', () => {
    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Game 2')).toBeInTheDocument();
  });

  it('renders error state when error occurs', () => {
    const mockError = new Error('Test error message');
    (useGetGames as jest.Mock).mockReturnValue({
      games: [],
      filters: [],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: mockError,
      retry: jest.fn(),
    });

    render(<Home />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows loading more state when fetching more games', () => {
    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: true,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    const loadingSkeletons = screen.getAllByTestId('game-card-skeleton');
    expect(loadingSkeletons).toHaveLength(3); // 3 loading skeletons for "load more"
  });

  it('hides See More button when reaching the end', () => {
    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: true,
      currentPage: 2,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    expect(screen.queryByText('See More')).not.toBeInTheDocument();
  });

  it('calls retry when clicking Try Again button', () => {
    const mockRetry = jest.fn();
    (useGetGames as jest.Mock).mockReturnValue({
      games: [],
      filters: [],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: new Error('Test error'),
      retry: mockRetry,
    });

    render(<Home />);
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  it('updates URL with page parameter when loading more games', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: jest.fn(),
    });

    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    const seeMoreButton = screen.getByText('See More');
    fireEvent.click(seeMoreButton);

    expect(mockPush).toHaveBeenCalledWith('?page=2', { scroll: false });
  });

  it('maintains genre filter when updating page', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: jest.fn(),
    });

    // Mock searchParams to simulate existing genre filter
    const mockSearchParams = new URLSearchParams('genre=Action');
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams);

    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);
    const seeMoreButton = screen.getByText('See More');
    fireEvent.click(seeMoreButton);

    expect(mockPush).toHaveBeenCalledWith('?genre=Action&page=2', { scroll: false });
  });

  it('calls router.refresh when cart is updated', () => {
    const mockRefresh = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: mockRefresh,
    });

    (useGetGames as jest.Mock).mockReturnValue({
      games: mockGames,
      filters: ['Action', 'RPG'],
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      isReachingEnd: false,
      currentPage: 1,
      error: null,
      retry: jest.fn(),
    });

    render(<Home />);

    // Find the first game card and simulate cart update
    const firstGameCard = screen
      .getByText('Game 1')
      .closest('[data-testid="game-card"]') as HTMLElement;
    const updateCartButton = within(firstGameCard).getByRole('button', { name: /add to cart/i });
    fireEvent.click(updateCartButton);

    expect(mockRefresh).toHaveBeenCalled();
  });
});
