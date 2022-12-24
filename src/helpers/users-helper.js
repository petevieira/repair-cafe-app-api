/**
 * @requires bcrypt
 * @requires jsonwebtoken
 */

const bcrypt = require('bcrypt');
// import package for managing JSON web tokens
const jwt = require('jsonwebtoken');

/**
 * hashes user password
 * @param {string} password - user password, unhashed
 * @return {Promise} promise gives hashed password, otherwise error object
 */
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
}

/**
 * compares password against a hashed password
 * @param {string} password - password to compare
 * @param {string} hashed - hashed password to compare password to
 * @return {bool} true if the same, false if different
 */
function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

function createSignedJwtToken(id, jwtSecret, tokenExpiration) {
  return jwt.sign(
    { _id: id },
    jwtSecret,
    { expiresIn: tokenExpiration });
}

module.exports = { hashPassword, comparePassword, createSignedJwtToken };
