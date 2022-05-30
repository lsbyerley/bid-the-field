import React from 'react';
import { render, screen } from 'test-utils';
import Countdown from './Countdown';

jest.mock('date-fns', () => ({
  format: jest.fn((props) => JSON.stringify(props)),
  secondsToHours: jest.fn((props) => JSON.stringify(props)),
  secondsToMinutes: jest.fn((props) => JSON.stringify(props)),
}));

/*jest.mock('rooks', () => ({
  useCountdown: jest.fn(),
}));*/

const defaultProps = (overrides) => {
  return {
    auction: {
      start_date: 'test',
      end_date: 'test',
    },
    auctionStarted: true,
    auctionOver: false,
    ...overrides,
  };
};

const renderCountdown = (props) => {
  const utils = render(<Countdown {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('Countdown', () => {
  it('should render and match snapshot', () => {
    const { home } = renderCountdown(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
