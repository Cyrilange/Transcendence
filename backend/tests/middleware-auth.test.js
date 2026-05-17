const test = require('node:test');
const assert = require('node:assert/strict');
const requireAuth = require('../middleware/auth');

test('requireAuth calls next() when session.user is set', () => {
  let nextCalled = false;
  const req = { session: { user: { id: 1, login: 'csalamit' } } };
  const res = { status: () => res, json: () => res };
  requireAuth(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test('requireAuth returns 401 with error JSON when session.user is missing', () => {
  let statusCode, body;
  let nextCalled = false;
  const req = { session: {} };
  const res = {
    status(code) { statusCode = code; return this; },
    json(b)     { body = b;          return this; },
  };
  requireAuth(req, res, () => { nextCalled = true; });
  assert.equal(statusCode, 401);
  assert.deepEqual(body, { error: 'Not logged in' });
  assert.equal(nextCalled, false);
});
