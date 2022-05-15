import React from 'react';
import { render, screen } from 'test-utils';
import Results from './Results';

jest.mock('@/lib/auctionUtils', () => ({
  getAuctionResults: jest.fn((props) => {
    return {
      testowner: [{ id: 'test', player_id: 'test', amount: '25' }],
    };
  }),
  getPlayerFromBid: jest.fn((props) => JSON.stringify(props)),
}));

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
    players: [
      {
        player_id: 'test',
      },
    ],
    ...overrides,
  };
};

const renderResults = (props) => {
  const utils = render(<Results {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('Results', () => {
  it('should render and match snapshot', () => {
    const { home } = renderResults(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
