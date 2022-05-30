import React from 'react';
import { render, screen } from 'test-utils';
import BidModal from './BidModal';

jest.mock('@headlessui/react', () => ({
  Dialog: jest.fn(({ props }) => <div>Dialog {JSON.stringify(props)}</div>),
  'Dialog.Overlay': jest.fn(({ props }) => (
    <div>DialogOverlay {JSON.stringify(props)}</div>
  )),
  Transition: jest.fn(({ props }) => (
    <div>Transition {JSON.stringify(props)}</div>
  )),
  'Transition.Child': jest.fn(({ props }) => (
    <div>TransitionOverlay {JSON.stringify(props)}</div>
  )),
}));

/*jest.mock('../NavBar', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((props) => {
    return <div role='nav'>{JSON.stringify(props)}</div>;
  }),
}));*/

const defaultProps = (overrides) => {
  return {
    isOpen: true,
    setIsOpen: () => {},
    onSubmit: () => {},
    player: null,
    highestBid: null,
    ...overrides,
  };
};

const renderBidModal = (props) => {
  const utils = render(<BidModal {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('BidModal', () => {
  it('should render and match snapshot', () => {
    const { home } = renderBidModal(defaultProps());
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
