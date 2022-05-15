import React from 'react';
import { render, screen } from 'test-utils';
import Modal from './Modal';

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

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props) => {
    return <div data-testid='react-markdown'>{JSON.stringify(props)}</div>;
  },
}));

jest.mock('remark-gfm', () => ({
  default: jest.fn(),
}));

jest.mock('@/AppContext', () => ({
  useAppContext: () => ({
    modalOpen: true,
    setModalOpen: jest.fn(),
    modalContent: 'test',
    setModalContent: jest.fn(),
  }),
}));

const renderModal = (props) => {
  const utils = render(<Modal {...props} />);
  const home = utils.container.firstChild;
  return { ...utils, home };
};

describe('Modal', () => {
  it('should render and match snapshot', () => {
    const { home } = renderModal();
    expect(home).toBeTruthy();
    expect(home).toMatchSnapshot();
  });
});
