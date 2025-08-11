const CustomError = require("./CustomError");

class BadRequestError extends CustomError {
  constructor(message, deneme = "12345") {
    super(message, 400);
  }
}

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message, 401);
  }
}

// const error = new BadRequestError("Geçersiz istek");
// console.log(error.message);
// console.log(error.statusCode);
// console.log(error.deneme);
// console.log(error.name);
module.exports = { BadRequestError, UnauthenticatedError };
