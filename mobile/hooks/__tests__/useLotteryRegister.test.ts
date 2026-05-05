import { renderHook, waitFor, act } from '@testing-library/react-native';
import useLotteryRegister from '../useLotteryRegister';
import * as LotteryService from '../../services/lottery';
import useAsyncStorage from '../useAsyncStorage';

jest.mock('../../services/lottery');
jest.mock('../useAsyncStorage');

const mockLotteryService = jest.mocked(LotteryService);
const mockUseAsyncStorage = jest.mocked(useAsyncStorage);

describe('useLotteryRegister', () => {
  const mockStoreData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAsyncStorage.mockReturnValue({
      storedData: [],
      storeData: mockStoreData,
      getStoredData: jest.fn(),
    });
  });

  it('should initialize with loading false and no error', () => {
    const { result } = renderHook(() => useLotteryRegister());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should register to lotteries successfully', async () => {
    const name = 'John Doe';
    const lotteries = ['lottery1', 'lottery2'];

    mockLotteryService.registerToLottery.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLotteryRegister());

    let registrationResult;
    await act(async () => {
      registrationResult = await result.current.registerToLotteries({ name, lotteries });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLotteryService.registerToLottery).toHaveBeenCalledTimes(2);
    expect(mockLotteryService.registerToLottery).toHaveBeenCalledWith({
      name,
      lotteryId: 'lottery1',
    });
    expect(mockLotteryService.registerToLottery).toHaveBeenCalledWith({
      name,
      lotteryId: 'lottery2',
    });
    expect(mockStoreData).toHaveBeenCalledWith(lotteries);
    expect(registrationResult).toHaveLength(2);
  });

  it('should set loading to true while registering', async () => {
    const name = 'John Doe';
    const lotteries = ['lottery1'];

    mockLotteryService.registerToLottery.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    const { result } = renderHook(() => useLotteryRegister());

    act(() => {
      result.current.registerToLotteries({ name, lotteries });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle errors when registration fails', async () => {
    const name = 'John Doe';
    const lotteries = ['lottery1'];
    const errorMessage = 'Registration failed';

    mockLotteryService.registerToLottery.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLotteryRegister());

    await act(async () => {
      try {
        await result.current.registerToLotteries({ name, lotteries });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(mockStoreData).not.toHaveBeenCalled();
  });

  it('should clear error on successful registration after previous error', async () => {
    const name = 'John Doe';
    const lotteries = ['lottery1'];

    const { result } = renderHook(() => useLotteryRegister());

    mockLotteryService.registerToLottery.mockRejectedValueOnce(new Error('First error'));
    await act(async () => {
      try {
        await result.current.registerToLotteries({ name, lotteries });
      } catch (error) {
        // Expected error
      }
    });

    mockLotteryService.registerToLottery.mockResolvedValueOnce(undefined);
    await act(async () => {
      await result.current.registerToLotteries({ name, lotteries });
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(mockStoreData).toHaveBeenCalledWith(lotteries);
  });
});
