import React from 'react';
import { render, screen } from 'test-utils';
import StartDateCard from './StartDateCard';

jest.mock('date-fns', () => ({
  format: jest.fn((props) => JSON.stringify(props)),
}));

const defaultProps = (overrides) => {
  return {
    auction: {
      start_date: 'test',
    },
    auctionStarted: true,
    ...overrides,
  };
};

const renderStartDateCard = (props) => {
  const utils = render(<StartDateCard {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('StartDateCard', () => {
  it('should render and match snapshot', () => {
    const { home } = renderStartDateCard(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
