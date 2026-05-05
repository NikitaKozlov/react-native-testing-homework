import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LotteryForm from '../Form';
import { useNewLottery } from '../../hooks/useNewLottery';

jest.mock('../../hooks/useNewLottery');

const useNewLotteryMock = jest.mocked(useNewLottery);

describe('LotteryForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnNavigateBack = jest.fn();
  const mockCreateNewLottery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNewLotteryMock.mockReturnValue({
      data: undefined,
      error: undefined,
      loading: false,
      createNewLottery: mockCreateNewLottery,
    });
  });

  it('should render the form component', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    expect(getByText('Add new lottery')).toBeTruthy();
    expect(getByPlaceholderText('Lottery Name')).toBeTruthy();
    expect(getByPlaceholderText('Lottery Prize')).toBeTruthy();
    
    await waitFor(() => {
      const submitButton = getByRole('button');
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  it('should update input values when typing', () => {
    const { getByPlaceholderText } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    const nameInput = getByPlaceholderText('Lottery Name');
    const prizeInput = getByPlaceholderText('Lottery Prize');

    fireEvent.changeText(nameInput, 'Test Lottery');
    fireEvent.changeText(prizeInput, 'Test Prize');

    expect(nameInput.props.value).toBe('Test Lottery');
    expect(prizeInput.props.value).toBe('Test Prize');
  });

  it('should keep submit button disabled with short inputs', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    const nameInput = getByPlaceholderText('Lottery Name');
    const prizeInput = getByPlaceholderText('Lottery Prize');

    fireEvent.changeText(nameInput, 'abc');
    fireEvent.changeText(prizeInput, 'xyz');

    await waitFor(() => {
      const submitButton = getByRole('button');
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  it('should call createNewLottery and onSubmit when form is submitted', async () => {
    mockCreateNewLottery.mockResolvedValue({});

    const { getByPlaceholderText, getByRole } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    const nameInput = getByPlaceholderText('Lottery Name');
    const prizeInput = getByPlaceholderText('Lottery Prize');
    const submitButton = getByRole('button');

    fireEvent.changeText(nameInput, 'Test Lottery');
    fireEvent.changeText(prizeInput, 'Test Prize');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockCreateNewLottery).toHaveBeenCalledWith({
        name: 'Test Lottery',
        prize: 'Test Prize',
      });
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should show loading indicator when submitting', () => {
    useNewLotteryMock.mockReturnValue({
      data: undefined,
      error: undefined,
      loading: true,
      createNewLottery: mockCreateNewLottery,
    });

    const { getByRole, queryByText } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    const submitButton = getByRole('button');
    expect(queryByText('ADD')).toBeNull();
    expect(submitButton.findByType('ActivityIndicator')).toBeTruthy();
  });

  it('should display error message when there is an error', () => {
    useNewLotteryMock.mockReturnValue({
      data: undefined,
      error: 'Something went wrong',
      loading: false,
      createNewLottery: mockCreateNewLottery,
    });

    const { getByText } = render(
      <LotteryForm onSubmit={mockOnSubmit} onNavigateBack={mockOnNavigateBack} />
    );

    expect(getByText('error')).toBeTruthy();
  });
});
