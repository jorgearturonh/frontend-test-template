import { render, screen } from '@/utils/test-utils';
import SuccessPage from './page';

describe('SuccessPage', () => {
  beforeEach(() => {
    render(<SuccessPage />);
  });

  it('renders success message and continue shopping button', () => {
    // Check for success message
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your purchase.')).toBeInTheDocument();

    // Check for continue shopping button
    const continueButton = screen.getByRole('link', { name: /continue shopping/i });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveAttribute('href', '/');
  });
});
