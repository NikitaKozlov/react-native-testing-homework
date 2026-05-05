import { renderHook, waitFor } from '@testing-library/react-native';
import useLotteries from '../useLotteries';
import * as LotteryService from '../../services/lottery';
import { Lottery } from '../../types';

jest.mock('../../services/lottery');

const mockLotteryService = jest.mocked(LotteryService);

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
];

describe('useLotteries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty data and loading false', async () => {
    mockLotteryService.getLottieries.mockResolvedValue([]);

    const { result } = renderHook(() => useLotteries());

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should fetch lotteries on mount while setting correct loading state', async () => {
    mockLotteryService.getLottieries.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockLotteries), 100))
    );

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockLotteries);
    expect(mockLotteryService.getLottieries).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when fetching lotteries', async () => {
    const errorMessage = 'Failed to fetch lotteries';
    mockLotteryService.getLottieries.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toEqual([]);
  });

  it('should refetch lotteries when fetchLotteries is called', async () => {
    mockLotteryService.getLottieries
      .mockResolvedValueOnce([mockLotteries[0]])
      .mockResolvedValueOnce(mockLotteries);

    const { result } = renderHook(() => useLotteries());
    await waitFor(async () => {
      await result.current.fetchLotteries();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockLotteries);
    });

    expect(mockLotteryService.getLottieries).toHaveBeenCalledTimes(2);
  });

  it('should clear error on successful refetch', async () => {
    mockLotteryService.getLottieries
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce(mockLotteries);

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(result.current.error).toBe('First error');
    });

    await waitFor(async () => {
      await result.current.fetchLotteries();
    });

    await waitFor(() => {
      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toEqual(mockLotteries);
    });
  });
});
