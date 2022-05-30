import React from 'react';
import { render, screen } from 'test-utils';
import Home from './index';

jest.mock('../lib/supabaseClient', () => ({
  supabase: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn(),
    }),
  }),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: 'test',
    status: 'not-loading',
  }),
}));

jest.mock('../lib/auctionUtils', () => ({
  hasAuctionStarted: jest.fn((props) => {
    return true;
  }),
  isAuctionOver: jest.fn((props) => {
    return false;
  }),
}));

const renderHome = (props) => {
  const utils = render(<Home {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

const defaultProps = (overrides) => {
  return {
    auctions: [
      { id: 'test', name: 'test', description: 'test', end_date: 'test' },
    ],
    ...overrides,
  };
};

describe('Home', () => {
  it('should render and match snapshot', () => {
    const { home } = renderHome();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });

  it('should render the heading', () => {
    const textToFind = 'Join an auction and bid on players or teams';

    renderHome();
    const heading = screen.getByText(textToFind);

    expect(heading).toBeInTheDocument();
  });

  it('should render an auction', () => {
    const { home } = renderHome(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
