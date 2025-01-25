import { render, screen } from '@/utils/test-utils';
import { server } from '@/mocks/setup';
import Home from './page';
import { emulateLoading, getGamesWithCustomResponseOnce } from '@/mocks/handlers';

const mockGames = [
  {
    id: '1',
    genre: 'Action',
    image: '/game-images/game1.jpg',
    name: 'Test Game 1',
    description: 'Test description 1',
    price: 59.99,
    isNew: true,
  },
  {
    id: '2',
    genre: 'RPG',
    image: '/game-images/game2.jpg',
    name: 'Test Game 2',
    description: 'Test description 2',
    price: 49.99,
    isNew: false,
  },
];

describe('Page', () => {
  beforeEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  describe('Items', () => {
    it('displays games after loading', async () => {
      server.use(
        getGamesWithCustomResponseOnce({
          games: mockGames,
          availableFilters: ['Action', 'RPG'],
          totalPages: 1,
          currentPage: 1,
        })
      );

      render(<Home />);

      // Wait for loading state to appear first
      expect(screen.getAllByTestId('game-card-skeleton')).toHaveLength(6);

      // Wait for the games to appear using findByText instead of getByText
      await screen.findByText('Test Game 1');
      await screen.findByText('Test Game 2');
    });
  });
});
