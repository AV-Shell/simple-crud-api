const {
  errorHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
} = require('./common/errorHandler');
const OrientExpress = require('./OrientExpress/OrientExpress');
const personsRouter = require('./resources/persons/persons.router');

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

const app = new OrientExpress();
app.setErrorHandler(errorHandler);

app.use(OrientExpress.bodyParser);

app.use(personsRouter.middleware);

module.exports = app;
