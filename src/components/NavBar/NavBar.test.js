import React from 'react';
import { render, screen } from 'test-utils';
import NavBar from './NavBar';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: {
      user: {
        email: 'test@test.com',
        image: 'testimage',
      },
    },
    status: 'not-loading',
  }),
  signOut: jest.fn(),
}));

const renderNavBar = (props) => {
  const utils = render(<NavBar {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('NavBar', () => {
  it('should render and match snapshot', () => {
    const { home } = renderNavBar();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });

  it('should render a signin button when no session data', () => {});
});
