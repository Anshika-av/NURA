const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

// Convert a plain-text password into a secure hash
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Check whether a password matches its stored hash
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};

