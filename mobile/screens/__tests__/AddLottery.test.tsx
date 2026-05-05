import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddLottery from '../AddLottery';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import { useNewLottery } from '../../hooks/useNewLottery';

jest.mock('react-native-toast-notifications');
jest.mock('@react-navigation/native');
jest.mock('../../hooks/useNewLottery');

const useToastMock = jest.mocked(useToast);
const useNavigationMock = jest.mocked(useNavigation);
const useNewLotteryMock = jest.mocked(useNewLottery);

describe('AddLottery Integration Test', () => {
  const showMock = jest.fn();
  const goBackMock = jest.fn();
  const createNewLotteryMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useToastMock.mockReturnValue({
      show: showMock,
      hide: jest.fn(),
      hideAll: jest.fn(),
      update: jest.fn(),
    } as any);

    useNavigationMock.mockReturnValue({
      goBack: goBackMock,
    } as any);

    useNewLotteryMock.mockReturnValue({
      data: undefined,
      error: undefined,
      loading: false,
      createNewLottery: createNewLotteryMock,
    });
  });


  it('should complete full submission flow: create lottery, show toast, and navigate back', async () => {
    createNewLotteryMock.mockResolvedValue({});

    const { getByPlaceholderText, getByRole } = render(<AddLottery />);

    const nameInput = getByPlaceholderText('Lottery Name');
    const prizeInput = getByPlaceholderText('Lottery Prize');

    fireEvent.changeText(nameInput, 'My Lottery');
    fireEvent.changeText(prizeInput, 'Grand Prize');

    await waitFor(() => {
      const submitButton = getByRole('button');
      expect(submitButton.props.accessibilityState.disabled).toBe(false);
    });

    const submitButton = getByRole('button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(createNewLotteryMock).toHaveBeenCalledWith({
        name: 'My Lottery',
        prize: 'Grand Prize',
      });
    });

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('New lottery added successfully!');
    });

    await waitFor(() => {
      expect(goBackMock).toHaveBeenCalled();
    });
  });


  it('should display error message when submission fails', () => {
    useNewLotteryMock.mockReturnValue({
      data: undefined,
      error: 'Network error',
      loading: false,
      createNewLottery: createNewLotteryMock,
    });

    const { getByText } = render(<AddLottery />);

    expect(getByText('error')).toBeTruthy();
  });

});
