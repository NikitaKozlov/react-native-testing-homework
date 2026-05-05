import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useNewLottery } from '../useNewLottery';
import * as LotteryService from '../../services/lottery';
import { Lottery } from '../../types';

jest.mock('../../services/lottery');

const mockLotteryService = jest.mocked(LotteryService);

const mockLottery: Lottery = {
  id: '1',
  name: 'Test Lottery',
  prize: '$1000',
  type: 'raffle',
  status: 'running',
};

describe('useNewLottery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with undefined data, loading false, and no error', () => {
    const { result } = renderHook(() => useNewLottery());

    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should create a new lottery successfully while setting correct loading state', async () => {
    const lotteryData = {
      name: 'Test Lottery',
      prize: '$1000',
    };

    mockLotteryService.createNewLottery.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockLottery), 100))
    );

    const { result } = renderHook(() => useNewLottery());

    act(() => {
      result.current.createNewLottery(lotteryData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockLottery);
    expect(mockLotteryService.createNewLottery).toHaveBeenCalledWith(lotteryData);
  });

  it('should handle errors when lottery creation fails', async () => {
    const lotteryData = {
      name: 'Test Lottery',
      prize: '$1000',
    };
    const errorMessage = 'Failed to create lottery';

    mockLotteryService.createNewLottery.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useNewLottery());

    await act(async () => {
      try {
        await result.current.createNewLottery(lotteryData);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeUndefined();
  });

  it('should clear error on successful creation after previous error', async () => {
    const lotteryData = {
      name: 'Test Lottery',
      prize: '$1000',
    };

    const { result } = renderHook(() => useNewLottery());

    mockLotteryService.createNewLottery.mockRejectedValueOnce(new Error('First error'));
    await act(async () => {
      try {
        await result.current.createNewLottery(lotteryData);
      } catch (error) {
        // Expected error
      }
    });

    mockLotteryService.createNewLottery.mockResolvedValueOnce(mockLottery);
    await act(async () => {
      await result.current.createNewLottery(lotteryData);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockLottery);
  });
});
