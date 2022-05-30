import React from 'react';
import { render, screen } from 'test-utils';
import AccessDenied from './AccessDenied';

const renderAccessDenied = (props) => {
  const utils = render(<AccessDenied {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('AccessDenied', () => {
  it('should render and match snapshot', () => {
    const { home } = renderAccessDenied();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
