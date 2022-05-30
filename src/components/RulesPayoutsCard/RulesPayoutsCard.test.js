import React from 'react';
import { render, screen } from 'test-utils';
import RulesPayoutsCard from './RulesPayoutsCard';

const defaultProps = (overrides) => {
  return {
    auction: {
      rules: 'test',
      payouts: 'test',
    },
    ...overrides,
  };
};

const renderRulesPayoutsCard = (props) => {
  const utils = render(<RulesPayoutsCard {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('RulesPayoutsCard', () => {
  it('should render and match snapshot', () => {
    const { home } = renderRulesPayoutsCard(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
