import { render, screen, fireEvent } from '@/utils/test-utils';
import { CheckoutModal } from './CheckoutModal';

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

const mockCartItems = [
  {
    id: '1',
    name: 'Test Game 1',
    description: 'Test Description 1',
    price: 59.99,
    genre: 'Action',
    image: '/test1.jpg',
    isNew: true,
  },
  {
    id: '2',
    name: 'Test Game 2',
    description: 'Test Description 2',
    price: 49.99,
    genre: 'RPG',
    image: '/test2.jpg',
    isNew: false,
  },
];

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
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
    expect(screen.getByText('Test Game 2')).toBeInTheDocument();

    // Check total
    expect(screen.getByText('$109.98')).toBeInTheDocument();
  });
});
