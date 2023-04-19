import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchInput from './SearchInput';

describe('SearchInput component', () => {
  const setSearch = jest.fn();
  const resetInput = jest.fn();
  const defaultProps = {
    id: 'test-input',
    label: 'Search',
    value: '',
    placeholder: 'Type to search',
    hiddenLabel: false,
    setSearch,
    resetInput,
    className: 'test-class',
  };

  test('renders SearchInput component with correct label and placeholder', () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type to search')).toBeInTheDocument();
  });
});
