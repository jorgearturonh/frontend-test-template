import { render, screen } from '@/utils/test-utils';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders navbar, children, and footer', () => {
    const mockChildren = <div data-testid="mock-children">Test Content</div>;

    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check if navbar is rendered
    expect(screen.getByText('GamerShop')).toBeInTheDocument();

    // Check if children content is rendered
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Check if footer is rendered with logo
    expect(screen.getByAltText('Apply Digital Logo')).toBeInTheDocument();
  });
});
