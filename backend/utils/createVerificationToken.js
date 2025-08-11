const { v4: uuidv4 } = require("uuid");

const createVerificationToken = () => {
  return uuidv4();
};

module.exports = createVerificationToken;
