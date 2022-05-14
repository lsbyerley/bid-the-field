import React from 'react';
import { render, screen } from 'test-utils';
import AuctionPage from './[id]';

jest.mock('../../lib/supabaseClient', () => ({
  /*supabase: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn(),
      on: jest.fn(),
      removeSubscription: jest.fn(),
    }),
  }),*/
  supabase: jest.fn(() => ({
    from: jest.fn(),
    select: jest.fn(),
    on: jest.fn(),
    removeSubscription: jest.fn(),
  })),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: 'test',
    status: 'not-loading',
  }),
}));

/*jest.mock('../../lib/auctionUtils', () => ({
  isAuctionOver: jest.fn((props) => {
    console.log('LOG: isAuctionOver props', props);
    return false;
  }),
}));*/

jest.mock('date-fns', () => ({
  format: jest.fn(() => {}),
  isBefore: jest.fn(() => {}),
  isAfter: jest.fn(() => {}),
  differenceInSeconds: jest.fn(() => {}),
  differenceInMinutes: jest.fn(() => {}),
  secondsToHours: jest.fn(() => {}),
  secondsToMinutes: jest.fn(() => {}),
}));

const renderAuctionPage = (props) => {
  const utils = render(<AuctionPage {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

const defaultProps = (overrides) => {
  return {
    auction: {
      id: 'test',
      name: 'test',
      description: 'test',
      start_date: 'test',
      end_date: 'test',
    },

    ...overrides,
  };
};

describe('AuctionPage', () => {
  it('should render and match snapshot', () => {
    const { home } = renderAuctionPage();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });

  /*it('should render the heading', () => {
    const textToFind = 'Join an auction and bid on players or teams';

    renderHome();
    const heading = screen.getByText(textToFind);

    expect(heading).toBeInTheDocument();
  });

  it('should render an auction', () => {
    const { home } = renderHome(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });*/
});
