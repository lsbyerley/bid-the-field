import React from 'react';
import { render, screen } from 'test-utils';
import TotalPot from './TotalPot';

const defaultProps = (overrides) => {
  return {
    bids: [
      {
        id: 'test',
        owner: 'testowner',
        amount: '25',
        player_id: 'test',
        auction_id: 'test',
      },
    ],
    ...overrides,
  };
};

const renderTotalPot = (props) => {
  const utils = render(<TotalPot {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('TotalPot', () => {
  it('should render and match snapshot', () => {
    const { home } = renderTotalPot(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
