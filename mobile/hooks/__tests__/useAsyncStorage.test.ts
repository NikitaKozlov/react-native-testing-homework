import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAsyncStorage from '../useAsyncStorage';

jest.mock('@react-native-async-storage/async-storage');

const mockAsyncStorage = jest.mocked(AsyncStorage);

describe('useAsyncStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with undefined storedData', () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const { result } = renderHook(() => useAsyncStorage());

    expect(result.current.storedData).toBeUndefined();
  });

  it('should fetch stored data on mount', async () => {
    const mockData = ['lottery1', 'lottery2'];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

    const { result } = renderHook(() => useAsyncStorage());

    await waitFor(() => {
      expect(result.current.storedData).toEqual(mockData);
    });

    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@selectedLotteries');
  });

  it('should store new data and append to existing data', async () => {
    const existingData = ['lottery1'];
    const newData = ['lottery2', 'lottery3'];

    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.storeData(newData);
    });

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@selectedLotteries',
      JSON.stringify([...existingData, ...newData])
    );
  });

  it('should store data when no existing data', async () => {
    const newData = ['lottery1'];

    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.storeData(newData);
    });

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      '@selectedLotteries',
      JSON.stringify(newData)
    );
  });

  it('should handle errors when fetching data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

    renderHook(() => useAsyncStorage());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when storing data', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.storeData(['lottery1']);
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should refresh stored data when getStoredData is called', async () => {
    const initialData = ['lottery1'];
    const updatedData = ['lottery1', 'lottery2'];

    mockAsyncStorage.getItem
      .mockResolvedValueOnce(JSON.stringify(initialData))
      .mockResolvedValueOnce(JSON.stringify(updatedData));

    const { result } = renderHook(() => useAsyncStorage());

    await waitFor(() => {
      expect(result.current.storedData).toEqual(initialData);
    });

    await act(async () => {
      await result.current.getStoredData();
    });

    await waitFor(() => {
      expect(result.current.storedData).toEqual(updatedData);
    });
  });
});
