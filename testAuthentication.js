const axios = require('axios');

const CryptoJS = require('crypto-js');

// Constants
const API_URL = 'http://localhost:3000/api/users'; // Update with your endpoint
const API_KEY = '304f73d2-b258-434b-8f1f-4eb20d8dafef'; // Replace with your seeded API key
const SECRET = 'a0014fe6184984b841a74c525c9be55673453f21c10de73b910dca815547afd3'; // Replace with your seeded secret key

// Generate Signature Function
function generateSignature(secret) {
  const unixTs = Math.floor(Date.now() / 1000);
  const ts = unixTs - (unixTs % 30); // Round down to the nearest 30 seconds
  const message = ts.toString();
  
  // Convert the message and secret to WordArray before using in HMAC
  const hmac = CryptoJS.HmacSHA256(message, CryptoJS.enc.Utf8.parse(secret)).toString(CryptoJS.enc.Hex);
  return hmac;
}

// Test Function
async function testAuthentication() {
  const signature = generateSignature(SECRET);

  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-API-KEY': API_KEY,
        'X-API-SIGNATURE': signature,
      },
    });

    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run Test
testAuthentication();
