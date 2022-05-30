import React from 'react';
import { render, screen, userEvent } from 'test-utils';
import ThemeSwitch from './ThemeSwitch';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

const renderThemeSwitch = (props) => {
  const utils = render(<ThemeSwitch {...props} />);
  const themeSwitch = utils.container.firstChild;
  return { ...utils, themeSwitch };
};

describe('ThemeSwitch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dark mode', () => {
    useTheme.mockImplementation(() => ({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
    }));

    const { themeSwitch } = renderThemeSwitch();
    expect(themeSwitch).toBeTruthy();
    expect(themeSwitch).toMatchSnapshot();
  });

  it('renders light mode', () => {
    useTheme.mockImplementation(() => ({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
    }));

    const { themeSwitch } = renderThemeSwitch();
    expect(themeSwitch).toBeTruthy();
    expect(themeSwitch).toMatchSnapshot();
  });

  it('toggles light mode', async () => {
    const mockSetTheme = jest.fn();
    useTheme.mockImplementation(() => ({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    }));

    renderThemeSwitch();
    const button = screen.getByRole('switch');
    await userEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('toggles dark mode', async () => {
    const mockSetTheme = jest.fn();
    useTheme.mockImplementation(() => ({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    }));

    renderThemeSwitch();
    const button = screen.getByRole('switch');
    await userEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
