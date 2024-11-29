const { verifyToken } = require('../utils/jwtUtils');

const crypto = require('crypto');
const { generateSignature } = require('../utils/tokenUtils');
const { getApiKeyDetails } = require('../repositories/apiKeyRepository');
const { getCachedSecret, setCachedSecret } = require('../cache/cacheManager');
const authenticate = async(ctx, next) => {
  const authHeader = ctx.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return ctx.json({ message: 'Authentication required' },401)

  }
  const token = authHeader.split(' ')[1];

  try {
    const user = verifyToken(token);
    ctx.req.user = user; // Add user data to the request object
    await next(); // Proceed to the next handler
  } catch (error) {
    return ctx.json({ message: 'Invalid or expired token' },401)
  }
};

const authenticateRequest = async (ctx, next) => {
  const apiKey = ctx.req.header('X-API-KEY');
  const providedSignature = ctx.req.header('X-API-SIGNATURE');

  if (!apiKey || !providedSignature) {
    return ctx.json({ message: 'Missing API key or signature' }, 401);
  }

  // Check cache first
  let secret = getCachedSecret(apiKey);

  // If not in cache, fetch from the database and cache it
  if (!secret) {
    const apiKeyDetails = await getApiKeyDetails(apiKey);
    if (!apiKeyDetails || !apiKeyDetails.secret) {
      return ctx.json({ message: 'Invalid API key' }, 401);
    }

    secret = apiKeyDetails.secret;

    // Store the secret in the cache with a TTL (time-to-live)
    setCachedSecret(apiKey, secret);
  }

  // Generate the expected signature
  const expectedSignature = generateSignature(secret);

  // Compare the provided signature with the expected signature
  if (expectedSignature !== providedSignature) {
    return ctx.json({ message: 'Invalid signature' }, 401);
  }

  await next(); // Proceed to the next handler
};
module.exports = { authenticate,authenticateRequest };
