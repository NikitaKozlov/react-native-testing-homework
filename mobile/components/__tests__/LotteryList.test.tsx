import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LotteryList from '../LotteryList';
import { Lottery } from '../../types';

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
    status: 'finished',
  },
  {
    id: '3',
    name: 'Spring Lottery',
    prize: '$1500',
    type: 'raffle',
    status: 'running',
  },
];

describe('LotteryList', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the lottery list with all lotteries', () => {
    const { getByText, getByPlaceholderText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    expect(getByText('Lotteries')).toBeTruthy();
    expect(getByPlaceholderText('Filter lotteries')).toBeTruthy();
    expect(getByText('Summer Lottery')).toBeTruthy();
    expect(getByText('$1000')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();

    expect(getByText('Winter Lottery')).toBeTruthy();
    expect(getByText('$2000')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();

    expect(getByText('Spring Lottery')).toBeTruthy();
    expect(getByText('$1500')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('should filter lotteries based on search input', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    const searchInput = getByPlaceholderText('Filter lotteries');
    fireEvent.changeText(searchInput, 'Summer');

    expect(getByText('Summer Lottery')).toBeTruthy();
    expect(queryByText('Winter Lottery')).toBeNull();
    expect(queryByText('Spring Lottery')).toBeNull();
  });

  it('should display no search results message when filter has no matches', () => {
    const { getByPlaceholderText, getByText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    const searchInput = getByPlaceholderText('Filter lotteries');
    fireEvent.changeText(searchInput, 'NonExistent');

    expect(getByText(/No search results for `NonExistent`/)).toBeTruthy();
  });

  it('should display empty state when there are no lotteries', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={[]}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    expect(getByText('There are no lotteries currently')).toBeTruthy();
  });

  it('should call onPress when lottery item is pressed', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    const lotteryItem = getByText('Summer Lottery');
    fireEvent.press(lotteryItem);

    expect(mockOnPress).toHaveBeenCalledWith('1');
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when finished lottery is pressed', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />
    );

    const finishedLottery = getByText('Winter Lottery');
    fireEvent.press(finishedLottery);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when registered lottery is pressed', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={mockLotteries}
        loading={false}
        onPress={mockOnPress}
        selectedLotteries={[]}
        registeredLotteries={['1']}
      />
    );

    const registeredLottery = getByText('Summer Lottery');
    fireEvent.press(registeredLottery);

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
