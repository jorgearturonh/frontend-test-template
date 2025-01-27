import { render, screen, fireEvent } from '@/utils/test-utils';
import Navbar from './Navbar';
import { cartService } from '@/services/cartService';

// Mock cartService
jest.mock('@/services/cartService', () => ({
  cartService: {
    getCartCount: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cartService.subscribe as jest.Mock).mockImplementation(callback => {
      // Return unsubscribe function
      return () => {};
    });
  });

  it('shows cart count when items are in cart', () => {
    (cartService.getCartCount as jest.Mock).mockReturnValue(3);

    render(<Navbar />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show cart count when cart is empty', () => {
    (cartService.getCartCount as jest.Mock).mockReturnValue(0);

    render(<Navbar />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('unsubscribes from cart service on unmount', () => {
    const unsubscribe = jest.fn();
    (cartService.subscribe as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = render(<Navbar />);
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
