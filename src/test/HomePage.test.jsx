import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../HomePage';
import { MemoryRouter } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

// Mock everything
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
  },
  fetchRecommendations: vi.fn(),
  fetchUpcomingEvents: vi.fn(),
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe('HomePage', () => {
  const mockOnNavigateColeccion = vi.fn();

  it('renders welcome message for unauthenticated user', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <HomePage onNavigateColeccion={mockOnNavigateColeccion} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Explora, guarda y personaliza tus rutas ecoturísticas/i)).toBeInTheDocument();
  });

  it('renders welcome message with user name for authenticated user', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Christian', role: 'user' } });
    vi.mocked(api.fetchUpcomingEvents).mockResolvedValue([]);
    vi.mocked(api.fetchRecommendations).mockResolvedValue([]);
    vi.mocked(api.api.get).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage onNavigateColeccion={mockOnNavigateColeccion} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hola,/i)).toBeInTheDocument();
    expect(screen.getByText(/Christian/i)).toBeInTheDocument();
  });

  it('renders the "Explorar colección" button', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <HomePage onNavigateColeccion={mockOnNavigateColeccion} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Explorar colección/i })).toBeInTheDocument();
  });
});
