import { render, screen, fireEvent } from '@/utils/test-utils';
import { GameCard } from './GameCard';
import { cartService } from '@/services/cartService';

// Mock cartService
jest.mock('@/services/cartService', () => ({
  cartService: {
    isInCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  },
}));

const mockGame = {
  id: '1',
  genre: 'Action',
  image: '/game-images/game1.jpg',
  name: 'Test Game',
  description: 'Test description',
  price: 59.99,
  isNew: true,
};

const mockGameLongName = {
  ...mockGame,
  name: 'This is a very long game name that should be truncated',
};

describe('GameCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders game information correctly', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={mockGame} />);

    expect(screen.getByText(mockGame.name)).toBeInTheDocument();
    expect(screen.getByText(mockGame.genre)).toBeInTheDocument();
    expect(screen.getByText(`$${mockGame.price}`)).toBeInTheDocument();
    expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
    expect(screen.getByAltText(mockGame.name)).toBeInTheDocument();
  });

  it('displays NEW badge when game is new', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={mockGame} />);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('does not display NEW badge when game is not new', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={{ ...mockGame, isNew: false }} />);

    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('truncates long game names and shows full name on hover', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={mockGameLongName} />);

    const truncatedText = screen.getByText('This is a very long game...');
    expect(truncatedText).toBeInTheDocument();

    const fullNameElement = screen.getByText(mockGameLongName.name);
    expect(fullNameElement).toBeInTheDocument();
    expect(fullNameElement).toHaveClass('game-name-hover');
  });

  it('shows ADD TO CART button when game is not in cart', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={mockGame} />);

    expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
  });

  it('shows REMOVE button when game is in cart', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(true);

    render(<GameCard game={mockGame} />);

    expect(screen.getByText('REMOVE')).toBeInTheDocument();
  });

  it('calls addToCart when Add to Cart is clicked', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);
    const onCartUpdate = jest.fn();

    render(<GameCard game={mockGame} onCartUpdate={onCartUpdate} />);

    fireEvent.click(screen.getByText('ADD TO CART'));

    expect(cartService.addToCart).toHaveBeenCalledWith(mockGame);
    expect(onCartUpdate).toHaveBeenCalled();
  });

  it('calls removeFromCart when Remove is clicked', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(true);
    const onCartUpdate = jest.fn();

    render(<GameCard game={mockGame} onCartUpdate={onCartUpdate} />);

    fireEvent.click(screen.getByText('REMOVE'));

    expect(cartService.removeFromCart).toHaveBeenCalledWith(mockGame.id);
    expect(onCartUpdate).toHaveBeenCalled();
  });

  it('handles cart update without onCartUpdate prop', () => {
    (cartService.isInCart as jest.Mock).mockReturnValue(false);

    render(<GameCard game={mockGame} />);

    fireEvent.click(screen.getByText('ADD TO CART'));

    expect(cartService.addToCart).toHaveBeenCalledWith(mockGame);
    // Should not throw error when onCartUpdate is not provided
  });
});
