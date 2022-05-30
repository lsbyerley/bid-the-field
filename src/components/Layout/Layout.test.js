import React from 'react';
import { render, screen } from 'test-utils';
import Layout from './Layout';

jest.mock('../NavBar', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((props) => {
    return <div role='nav'>{JSON.stringify(props)}</div>;
  }),
}));

const renderLayout = (props) => {
  const utils = render(<Layout {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('Layout', () => {
  it('should render and match snapshot', () => {
    const { home } = renderLayout();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
