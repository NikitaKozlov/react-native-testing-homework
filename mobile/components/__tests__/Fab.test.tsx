import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FAB from '../Fab';

describe('FAB', () => {
  it('should render the FAB component', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(<FAB onPress={onPressMock} />);
    const fab = getByRole('button');

    fireEvent.press(fab);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should render the add icon', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<FAB onPress={onPressMock} />);

    const icon = getByTestId("icon");
    expect(icon.props.name).toBe('add');
  });
});