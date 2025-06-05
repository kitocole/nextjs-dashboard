import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  it('toggles from light to dark', async () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light', systemTheme: 'light', setTheme });
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    await userEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light', async () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark', systemTheme: 'dark', setTheme });
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle dark mode/i });
    await userEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
