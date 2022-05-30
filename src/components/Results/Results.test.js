import React from 'react';
import { render, screen } from 'test-utils';
import Results from './Results';

jest.mock('@/lib/auctionUtils', () => ({
  ...jest.requireActual('@/lib/auctionUtils'),
  getAuctionResults: jest.fn((props) => {
    return {
      ownerOne: [
        {
          id: 'test',
          auction_id: 'test',
          player_id: '1',
          amount: 25,
          owner: 'ownerOne',
        },
      ],
      ownerTwo: [
        {
          id: 'test',
          auction_id: 'test',
          player_id: '2',
          amount: 15,
          owner: 'ownerTwo',
        },
      ],
    };
  }),
}));

const defaultProps = (overrides) => {
  return {
    bids: [
      {
        id: 'test',
        owner: 'ownerOne',
        amount: 25,
        player_id: '1',
        auction_id: 'test',
      },
      {
        id: 'test',
        owner: 'ownerTwo',
        amount: 20,
        player_id: '1',
        auction_id: 'test',
      },
    ],
    players: [
      {
        id: '1',
        full_name: 'test-full-1',
        short_name: 'test-short-1',
      },
      {
        id: '2',
        full_name: 'test-full-2',
        short_name: 'test-short-2',
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
