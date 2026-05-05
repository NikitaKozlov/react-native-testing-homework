import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterModal from '../RegisterModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import useLotteryRegister from '../../hooks/useLotteryRegister';

jest.mock('@react-navigation/native');
jest.mock('../../hooks/useLotteryRegister');

const useNavigationMock = jest.mocked(useNavigation);
const useRouteMock = jest.mocked(useRoute);
const useLotteryRegisterMock = jest.mocked(useLotteryRegister);

describe('RegisterModal Integration Test', () => {
  const goBackMock = jest.fn();
  const registerToLotteriesMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue({
      goBack: goBackMock,
    } as any);

    useRouteMock.mockReturnValue({
      params: {
        selectedLotteries: ['1', '2'],
      },
    } as any);

    useLotteryRegisterMock.mockReturnValue({
      error: undefined,
      loading: false,
      registerToLotteries: registerToLotteriesMock,
    });
  });

  it('should complete full submission flow: register to lotteries and navigate back', async () => {
    registerToLotteriesMock.mockResolvedValue([]);

    const { getByPlaceholderText, getByRole } = render(<RegisterModal />);

    const nameInput = getByPlaceholderText('Enter your name');

    fireEvent.changeText(nameInput, 'John Doe');

    await waitFor(() => {
      const submitButton = getByRole('button');
      expect(submitButton.props.accessibilityState.disabled).toBe(false);
    });

    const submitButton = getByRole('button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(registerToLotteriesMock).toHaveBeenCalledWith({
        name: 'John Doe',
        lotteries: ['1', '2'],
      });
    });

    await waitFor(() => {
      expect(goBackMock).toHaveBeenCalled();
    });
  });

  it('should display error message when submission fails', () => {
    useLotteryRegisterMock.mockReturnValue({
      error: 'Registration failed',
      loading: false,
      registerToLotteries: registerToLotteriesMock,
    });

    const { getByText } = render(<RegisterModal />);

    expect(getByText('error')).toBeTruthy();
  });
});
