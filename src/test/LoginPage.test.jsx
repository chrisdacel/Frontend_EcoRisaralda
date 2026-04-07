import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../context/AuthContext';

// Mock the services and context
vi.mock('../services/api', () => ({
  login: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    setUser: vi.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe('LoginPage', () => {
  const mockOnNavigateHome = vi.fn();
  const mockOnNavigateRegister = vi.fn();

  it('renders login form correctly', () => {
    render(
      <LoginPage 
        onNavigateHome={mockOnNavigateHome} 
        onNavigateRegister={mockOnNavigateRegister} 
      />
    );

    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    const { login } = await import('../services/api');
    login.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    render(
      <LoginPage 
        onNavigateHome={mockOnNavigateHome} 
        onNavigateRegister={mockOnNavigateRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  it('navigates home on successful login', async () => {
    const { login } = await import('../services/api');
    login.mockResolvedValueOnce({ id: 1, name: 'Test User' });

    render(
      <LoginPage 
        onNavigateHome={mockOnNavigateHome} 
        onNavigateRegister={mockOnNavigateRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockOnNavigateHome).toHaveBeenCalled();
    });
  });
});
