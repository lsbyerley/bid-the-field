import React from 'react';
import { render, screen } from 'test-utils';
import BidRow from './BidRow';

const defaultProps = (overrides) => {
  return {
    player: {},
    bids: [],
    biddingDisabled: false,
    disableTheField: false,
    ...overrides,
  };
};

const renderBidRow = (props) => {
  const utils = render(<BidRow {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('BidRow', () => {
  it('should render and match snapshot', () => {
    const { home } = renderBidRow(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
