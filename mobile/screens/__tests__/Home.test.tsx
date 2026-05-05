import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '../Home';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import useLotteries from '../../hooks/useLotteries';
import useAsyncStorage from '../../hooks/useAsyncStorage';
import { Lottery } from '../../types';

jest.mock('@react-navigation/native');
jest.mock('../../hooks/useLotteries');
jest.mock('../../hooks/useAsyncStorage');

const useNavigationMock = jest.mocked(useNavigation);
const useIsFocusedMock = jest.mocked(useIsFocused);
const useLotteriesMock = jest.mocked(useLotteries);
const useAsyncStorageMock = jest.mocked(useAsyncStorage);

const mockLotteries: Lottery[] = [
  {
    id: '1',
    name: 'Summer Lottery',
    prize: '$1000',
    type: 'raffle',
    status: 'running',
  },
  {
    id: '2',
    name: 'Winter Lottery',
    prize: '$2000',
    type: 'raffle',
    status: 'running',
  },
  {
    id: '3',
    name: 'Spring Lottery',
    prize: '$1500',
    type: 'raffle',
    status: 'finished',
  },
];

describe('Home Integration Test', () => {
  const navigateMock = jest.fn();
  const fetchLotteriesMock = jest.fn();
  const storeDataMock = jest.fn();
  const getStoredDataMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue({
      navigate: navigateMock,
    } as any);

    useIsFocusedMock.mockReturnValue(true);

    useLotteriesMock.mockReturnValue({
      data: mockLotteries,
      loading: false,
      error: undefined,
      fetchLotteries: fetchLotteriesMock,
    });

    useAsyncStorageMock.mockReturnValue({
      storedData: [],
      storeData: storeDataMock,
      getStoredData: getStoredDataMock,
    });
  });

  it('should navigate to Register screen with selected lotteries', () => {
    const { getByText } = render(<Home />);

    fireEvent.press(getByText('Summer Lottery'));
    fireEvent.press(getByText('Winter Lottery'));

    const registerButton = getByText('Register');
    fireEvent.press(registerButton);

    expect(navigateMock).toHaveBeenCalledWith('Register', {
      selectedLotteries: ['1', '2'],
    });
  });


  it('should navigate to AddLottery when FAB is pressed', () => {
    const { getByTestId } = render(<Home />);

    const fab = getByTestId('fab');

    fireEvent.press(fab);

    expect(navigateMock).toHaveBeenCalledWith('AddLottery');
  });
});
