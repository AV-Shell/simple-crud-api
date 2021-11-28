const http = require('http');
const config = require('../common/config');

module.exports = class Application {
  constructor(port) {
    this.port = port;
    this.server = this._createServer();
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  _json = (res) => {
    res.json = (data, statusCode = 200) => {
      res.writeHead(statusCode, {
        'Content-type': 'application/json',
      });
      res.end(JSON.stringify(data));
    };
  };

  _parseUrl(req) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    if (config?.DEBUG) {
      console.log('parsedUrl', parsedUrl);
    }
    req.parsedUrl = parsedUrl;
  }

  _createServer() {
    return http.createServer((req, res) => {
      this._parseUrl(req);
      this._json(res);
      let body = '';
      let isRunNext = true;
      const next = () => {
        isRunNext = true;
      };
      req.on('data', (partOfData) => {
        body += partOfData;
      });
      req.on('end', async () => {
        if (body) {
          req.body = body;
        }
        let midCount = 0;
        while (midCount < this.middlewares.length && isRunNext) {
          isRunNext = false;
          try {
            if (config?.DEBUG) {
              console.log('try middleware', this.middlewares[midCount]?.length);
            }
            await this.middlewares[midCount](req, res, next);
          } catch (err) {
            if (config?.DEBUG) {
              console.log('i catch error', err.message);
            }
            if (this.errorHandler && typeof this.errorHandler === 'function') {
              this.errorHandler(err, req, res);
            } else {
              throw err;
            }
          }
          midCount++;
        }
        if (isRunNext) {
          res.statusCode = 404;
          res.end('human friendly: No endpoints!   ¯\\_(ツ)_/¯');
        }
      });
    });
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  setErrorHandler(cb) {
    this.errorHandler = cb;
  }
  static bodyParser = (req, res, next) => {
    if (config?.DEBUG) {
      console.log('bodyPArser');
      console.log('req.body', req.body);
      if (req.body) {
        console.log('JSON.parse(req.body)', JSON.parse(req.body));
      }
    }
    if (req.body) {
      req.body = JSON.parse(req.body);
    }
    if (config?.DEBUG) {
      console.log('req.body', req.body);
    }
    next();
  };
};
