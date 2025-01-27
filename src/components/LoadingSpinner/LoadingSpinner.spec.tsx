import { render, screen } from '@/utils/test-utils';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
});
