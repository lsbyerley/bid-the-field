import React from 'react';
import { render, screen } from 'test-utils';
import NameCard from './NameCard';

const defaultProps = (overrides) => {
  return {
    auction: {
      name: 'test',
    },
    ...overrides,
  };
};

const renderNameCard = (props) => {
  const utils = render(<NameCard {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('NameCard', () => {
  it('should render and match snapshot', () => {
    const { home } = renderNameCard(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
