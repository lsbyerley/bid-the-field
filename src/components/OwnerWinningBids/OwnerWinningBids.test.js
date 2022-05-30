import React from 'react';
import { render, screen } from 'test-utils';
import OwnerWinningBids from './OwnerWinningBids';

jest.mock('@/lib/auctionUtils', () => ({
  getPlayerFromBid: jest.fn(() => {
    return {};
  }),
  getOwnerWinningBids: jest.fn(() => {
    return [];
  }),
}));

const renderOwnerWinningBids = (props) => {
  const utils = render(<OwnerWinningBids {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('OwnerWinningBids', () => {
  it('should render and match snapshot', () => {
    const { home } = renderOwnerWinningBids();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
