import { render, screen } from '@/utils/test-utils';
import Footer from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders footer with logo and home link', () => {
    // Check if logo exists with correct attributes
    const logo = screen.getByAltText('Apply Digital Logo');
    expect(logo).toBeInTheDocument();
    // Check if link exists and points to home
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
