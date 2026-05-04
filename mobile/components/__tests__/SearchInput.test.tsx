import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the search input component', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SearchInput value="" onSearch={mockOnSearch} />
    );

    const input = getByPlaceholderText('Filter lotteries');
    const icon = getByTestId('icon');

    expect(icon).toBeTruthy();
    expect(icon.props.name).toBe('search');
    expect(input).toBeTruthy();
  });

  it('should display the correct value', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="test search" onSearch={mockOnSearch} />
    );

    const input = getByPlaceholderText('Filter lotteries');
    expect(input.props.value).toBe('test search');
  });

  it('should call onSearch when text changes', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onSearch={mockOnSearch} />
    );

    const input = getByPlaceholderText('Filter lotteries');
    fireEvent.changeText(input, 'new search query');

    expect(mockOnSearch).toHaveBeenCalledWith('new search query');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
