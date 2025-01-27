import { render, screen } from '@/utils/test-utils';
import { GameCardSkeleton } from './Skeleton';

describe('GameCardSkeleton', () => {
  it('renders skeleton with default animation state', () => {
    render(<GameCardSkeleton />);

    const skeleton = screen.getByTestId('game-card-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');
    expect(skeleton).toHaveClass('product', 'card', 'animate-pulse');
  });
});
