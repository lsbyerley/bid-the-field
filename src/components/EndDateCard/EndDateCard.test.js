import React from 'react';
import { render, screen } from 'test-utils';
import EndDateCard from './EndDateCard';

jest.mock('date-fns', () => ({
  format: jest.fn((props) => JSON.stringify(props)),
}));

const defaultProps = (overrides) => {
  return {
    auction: {
      end_date: 'test',
    },
    auctionOver: false,
    ...overrides,
  };
};

const renderEndDateCard = (props) => {
  const utils = render(<EndDateCard {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('EndDateCard', () => {
  it('should render and match snapshot', () => {
    const { home } = renderEndDateCard(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
