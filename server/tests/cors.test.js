const request = require('supertest');

describe('CORS configuration', () => {
  const originalCorsOrigins = process.env.CORS_ORIGINS;

  afterEach(() => {
    if (originalCorsOrigins === undefined) {
      delete process.env.CORS_ORIGINS;
    } else {
      process.env.CORS_ORIGINS = originalCorsOrigins;
    }
  });

  test('allows origins from the comma-separated environment variable', async () => {
    process.env.CORS_ORIGINS = 'https://nura.example, https://preview.nura.example';

    let app;
    jest.isolateModules(() => {
      const express = require('express');
      app = express();
      app.use(require('../src/config/cors'));
      app.get('/', (_req, res) => res.sendStatus(200));
    });

    const response = await request(app)
      .get('/')
      .set('Origin', 'https://preview.nura.example');

    expect(response.headers['access-control-allow-origin']).toBe('https://preview.nura.example');
  });

  test('does not allow origins outside the configured list', async () => {
    process.env.CORS_ORIGINS = 'https://nura.example';

    let app;
    jest.isolateModules(() => {
      const express = require('express');
      app = express();
      app.use(require('../src/config/cors'));
      app.get('/', (_req, res) => res.sendStatus(200));
    });

    const response = await request(app)
      .get('/')
      .set('Origin', 'https://untrusted.example');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
