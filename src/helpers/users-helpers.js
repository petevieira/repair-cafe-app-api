/**
 * @namespace users
 * @module users-helper
 * @requires bcrypt
 * @requires jsonwebtoken
 */

const bcrypt = require('bcrypt'); // for hashing user passwords
const jwt = require('jsonwebtoken'); // for JSON Web Token helpers

/**
 * hashes user password
 * @param {string} password - user password, unhashed
 * @returns {Promise} promise gives hashed password, otherwise error object
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
 * @returns {bool} true if the same, false if different
 */
function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

/**
 * created a signed JSON Web Token
 * @param {string} id - ID of user
 * @param {string} jwtSecret - JSON Web Token secret
 * @param {string} tokenExpiration - expiration of the token
 * @returns {object} JSON Web Token that was created
 */
function createSignedJwtToken(id, jwtSecret, tokenExpiration) {
  return jwt.sign(
    { _id: id },
    jwtSecret,
    { expiresIn: tokenExpiration });
}

module.exports = { hashPassword, comparePassword, createSignedJwtToken };
