const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("HATA:", err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Sunucuda bir hata oluştu";

  res.status(statusCode).json({ msg: message });
};

module.exports = errorHandlerMiddleware;
