import { render, screen, fireEvent } from '@/utils/test-utils';
import { CheckoutModal } from './CheckoutModal';
import { mockGames } from '@/test/mocks';

// Mock cartService
jest.mock('@/services/cartService', () => ({
  cartService: {
    clearCart: jest.fn(),
  },
}));

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockCartItems = mockGames;

describe('CheckoutModal', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    cartItems: mockCartItems,
    total: 109.98,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(<CheckoutModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(<CheckoutModal {...mockProps} />);

    // Check header
    expect(screen.getByText('Checkout')).toBeInTheDocument();

    // Check payment methods
    expect(screen.getByAltText('Stripe')).toBeInTheDocument();
    expect(screen.getByAltText('Mercado Pago')).toBeInTheDocument();

    // Check cart items
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Game 2')).toBeInTheDocument();

    // Check total
    expect(screen.getByText('$109.98')).toBeInTheDocument();
  });

  it('handles payment method selection', () => {
    render(<CheckoutModal {...mockProps} />);

    // Initially should show Stripe as default
    expect(screen.getByText('Pay with Stripe')).toBeInTheDocument();

    // Click Mercado Pago button
    fireEvent.click(screen.getByAltText('Mercado Pago'));
    expect(screen.getByText('Pay with Mercado Pago')).toBeInTheDocument();

    // Click Stripe button
    fireEvent.click(screen.getByAltText('Stripe'));
    expect(screen.getByText('Pay with Stripe')).toBeInTheDocument();
  });

  it('handles payment processing flow', async () => {
    render(<CheckoutModal {...mockProps} />);

    const payButton = screen.getByTestId('pay-button');
    expect(payButton).toBeInTheDocument();
    expect(payButton).toHaveTextContent('Pay with Stripe');
    fireEvent.click(payButton);

    // Check loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(payButton).toBeDisabled();

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockProps.onClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('closes modal when clicking backdrop', () => {
    render(<CheckoutModal {...mockProps} />);

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('closes modal when clicking close button', () => {
    render(<CheckoutModal {...mockProps} />);

    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
