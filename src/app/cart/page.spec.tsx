import { render, screen, fireEvent, act } from '@/utils/test-utils';
import { cartService } from '@/services/cartService';
import CartPage from './page';
import { mockGames } from '@/test/mocks';

// Mock cartService
jest.mock('@/services/cartService', () => ({
  cartService: {
    getCart: jest.fn(),
    getCartTotal: jest.fn(),
    removeFromCart: jest.fn(),
    subscribe: jest.fn(),
  },
}));

// Mock CheckoutModal
jest.mock('@/components/CheckoutModal/CheckoutModal', () => ({
  CheckoutModal: jest.fn(({ isOpen }) => (isOpen ? <div>Checkout Modal</div> : null)),
}));

const mockGame = mockGames[0];

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cartService.subscribe as jest.Mock).mockImplementation(callback => {
      callback(); // Call the callback immediately
      return () => {};
    });
  });

  it('shows empty cart view when cart is empty', async () => {
    (cartService.getCart as jest.Mock).mockReturnValue([]);
    (cartService.getCartTotal as jest.Mock).mockReturnValue(0);

    render(<CartPage />);

    // Wait for loading state to finish
    await screen.findByText('Your cart is empty');
    expect(screen.getByText('Browse Games')).toBeInTheDocument();
  });

  it('opens checkout modal when checkout button is clicked', async () => {
    (cartService.getCart as jest.Mock).mockReturnValue([mockGame]);
    (cartService.getCartTotal as jest.Mock).mockReturnValue(59.99);

    render(<CartPage />);

    const checkoutButton = await screen.findByRole('button', { name: /checkout/i });
    fireEvent.click(checkoutButton);

    expect(screen.getByText('Checkout Modal')).toBeInTheDocument();
  });

  it('unsubscribes from cart service on unmount', () => {
    const unsubscribe = jest.fn();
    (cartService.subscribe as jest.Mock).mockReturnValue(unsubscribe);

    const { unmount } = render(<CartPage />);
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('displays New badge for new items', async () => {
    (cartService.getCart as jest.Mock).mockReturnValue([mockGame]);
    (cartService.getCartTotal as jest.Mock).mockReturnValue(59.99);

    render(<CartPage />);

    await screen.findByText('New');
  });
});
