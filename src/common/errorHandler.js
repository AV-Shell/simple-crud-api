const { MyCustomError } = require('./myCustomError');
const config = require('./config');

const uncaughtExceptionHandler = (err, origin) => {
  exceptionHandler(err);
};

const unhandledRejectionHandler = (err, promise) => {
  exceptionHandler(err);
};

function exceptionHandler(err) {
  console.error(err.message);
  process.exit(9);
}

const errorHandler = (err, req, res) => {
  if (err instanceof MyCustomError) {
    res.json(err.message, err.myErrStatus);
    if (config?.DEBUG) {
      console.log('custom error, status', err.myErrStatus);
      console.log('custom error, message', err.message);
    }
    return;
  }
  res.json('Something wrong', 500);
};

module.exports = { errorHandler, uncaughtExceptionHandler, unhandledRejectionHandler };
