
const CryptoJS = require('crypto-js');

function generateSignature(secret) {
  const unixTs = Math.floor(Date.now() / 1000);
  const ts = unixTs - (unixTs % 30); // Round down to the nearest 30 seconds
  const message = ts.toString();
  
  // Convert the message and secret to WordArray before using in HMAC
  const hmac = CryptoJS.HmacSHA256(message, CryptoJS.enc.Utf8.parse(secret)).toString(CryptoJS.enc.Hex);
  return hmac;
}

function isSignatureExpired(signatureTimestamp) {
  const currentTs = Math.floor(Date.now() / 1000);
  const difference = currentTs - signatureTimestamp;
  return difference > 30; // Signature valid for 30 seconds
}
module.exports = { generateSignature,isSignatureExpired };
