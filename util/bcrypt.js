const bcyrpt = require('bcryptjs');

const hashPassword = async (pwd) => {
  return await bcyrpt.hash(pwd, 16);
}

module.exports = hashPassword();