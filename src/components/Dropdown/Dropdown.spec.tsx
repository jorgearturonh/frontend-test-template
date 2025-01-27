import { render, screen, fireEvent } from '@/utils/test-utils';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    options: ['Action', 'RPG', 'Strategy'],
    label: 'Genre',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial props', () => {
    render(<Dropdown {...mockProps} />);

    expect(screen.getByText('Genre')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('shows selected value when provided', () => {
    render(<Dropdown {...mockProps} value="Action" />);

    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', () => {
    render(<Dropdown {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /all/i }));

    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
  });

  it('calls onChange with selected option', () => {
    render(<Dropdown {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));

    expect(mockProps.onChange).toHaveBeenCalledWith('Action');
  });

  it('closes dropdown when option is selected', () => {
    render(<Dropdown {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));

    expect(screen.queryByRole('button', { name: 'RPG' })).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Dropdown {...mockProps} />
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByText('Action')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });
});
