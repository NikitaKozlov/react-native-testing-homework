import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from '../Loader';

describe('Loader', () => {
  it('should render the Loader component', () => {
    const { getByTestId } = render(<Loader />);
    const activityIndicator = getByTestId('activity-indicator');

    expect(activityIndicator.props.size).toBe('large');
    expect(activityIndicator.props.color).toBe('#1976d2');
  });
});
