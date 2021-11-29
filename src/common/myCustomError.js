class MyCustomError extends Error {
  constructor(message = 'Error', status = 404) {
    super(message);
    this.myErrStatus = status;
  }
}

module.exports = { MyCustomError };
