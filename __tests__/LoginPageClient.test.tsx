import { render, screen } from '@testing-library/react';
import LoginPageClient from '@/components/login/LoginPageClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('LoginPageClient', () => {
  it('shows loading state', () => {
    (useSession as jest.Mock).mockReturnValue({ status: 'loading' });
    render(<LoginPageClient initialError="" />);
    expect(screen.getByText(/Loading…/)).toBeInTheDocument();
  });

  it('displays error message for AccessDenied', () => {
    (useSession as jest.Mock).mockReturnValue({ status: 'unauthenticated' });
    render(<LoginPageClient initialError="AccessDenied" />);
    expect(
      screen.getByText('Access denied. Please check your permissions or try again.')
    ).toBeInTheDocument();
  });
});
