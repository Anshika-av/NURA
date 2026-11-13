const request = require('supertest');
const app = require('../src/app');

describe('NURA API Tests', () => {
  // Test 1: Health check
  test('GET /api/v1/health should return 200', async () => {
    const response = await request(app)
      .get('/api/v1/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('NURA backend is running!');
  });

  // Test 2: API root
  test('GET /api/v1 should return 200', async () => {
    const response = await request(app)
      .get('/api/v1');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test 3: Unknown route
  test('Unknown route should return 404', async () => {
    const response = await request(app)
      .get('/api/v1/unknown');

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  // Test 4: Invalid registration data
  test('Registration with invalid data should return 400', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });
});
