/**
 * @namespace auth
 * @module auth-helpers
 * @requires bcrypt
 * @requires jsonwebtoken
 */

// for hashing user passwords
const bcrypt = require('bcrypt');
// for JSON Web Token helpers
const jwt = require('jsonwebtoken');

/**
 * created a signed JSON Web Token
 * @param {string} id - ID of user
 * @returns {object} JSON Web Token that was created
 */
const createSignedToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    }
  );
}

/**
 * hashes user password
 * @param {string} password - user password, unhashed
 * @returns {Promise} promise gives hashed password, otherwise error object
 */
const hashPassword = (password) => {
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
const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
}

module.exports = { createSignedToken, hashPassword, comparePassword };
