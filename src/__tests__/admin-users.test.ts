import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/admin/users/route';
import { client } from '@/lib/db';

// Mock database client
vi.mock('@/lib/db', () => ({
  client: {
    query: vi.fn(),
  },
}));

// Mock auth (cookies)
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: () => ({ value: 'mock-admin-token' }),
  }),
}));

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: () => ({ role: 'admin', sub: '1' }),
  },
}));

describe('Admin Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/admin/users returns users list', async () => {
    const mockUsers = [
      { id: 1, email: 'test@test.com', first_name: 'Test', last_name: 'User', role: 'user' }
    ];
    
    (client.query as any)
      .mockResolvedValueOnce({ rows: mockUsers }) // Main query
      .mockResolvedValueOnce({ rows: [{ count: '1' }] }); // Count query

    const req = new Request('http://localhost/api/admin/users');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.users).toHaveLength(1);
    expect(data.users[0].email).toBe('test@test.com');
  });

  it('POST /api/admin/users creates a user', async () => {
    const newUser = {
      email: 'new@test.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    };

    (client.query as any)
      .mockResolvedValueOnce({ rows: [] }) // Check existing
      .mockResolvedValueOnce({ rows: [{ id: 2, ...newUser, role: 'user' }] }); // Insert

    const req = new Request('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUser)
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.user.email).toBe('new@test.com');
  });
});
