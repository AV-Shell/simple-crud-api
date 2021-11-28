const config = require('../common/config');

module.exports = class Router {
  constructor() {
    this.endpoints = {};
    this.middleware = (req, res, next, ...args) => this._middleware(req, res, next, ...args);
  }

  parsePath(path) {
    return { path: path };
  }

  request(method = 'GET', path, handler) {
    if (config?.DEBUG) {
      console.log(`method ${method}, path ${path}, handler: ${handler?.name}`);
    }
    const parsedPath = this.parsePath(path);
    if (!this.endpoints[parsedPath.path]) {
      this.endpoints[parsedPath.path] = {};
    }
    const endpoint = this.endpoints[parsedPath.path];
    if (endpoint[method]) {
      console.error(`Method "${method}" in endpoint "${parsedPath.path}" is already exist`);
      return;
    } else {
      endpoint[method] = handler;
      this.requestPaths = Object.keys(this.endpoints);
      if (config?.DEBUG) {
        console.log(`Object.keys(this.endpoints); method(${method})`, this.requestPaths);
      }
    }
  }

  comparePath(storedPath, incomingPath) {
    if (config?.DEBUG) {
      console.log('storedPath', storedPath);
      console.log('incomingPath', incomingPath);
    }
    if (typeof storedPath !== 'string' || typeof incomingPath !== 'string') {
      if (config?.DEBUG) {
        console.log('some path invalid');
      }
      return;
    }

    const splitSP = storedPath?.split('/');
    const splitIP = incomingPath?.split('/');
    if (splitSP.length !== splitIP.length) {
      return false;
    }
    const params = {};
    if (
      splitSP.every((el, i) => {
        if (el[0] === ':' && el.length > 1) {
          params[`${el.slice(1)}`] = splitIP[i];
          return true;
        } else if (el === splitIP[i]) {
          return true;
        }
        return false;
      })
    ) {
      return params;
    }
    return false;
  }

  async _middleware(req, res, next) {
    if (config?.DEBUG) {
      console.log('middleware, this.requestPaths', this.requestPaths);
    }
    const hasRoute = false;
    let params;
    let midFunc;

    const hasPath = this.requestPaths.some((path) => {
      if (config?.DEBUG) {
        console.log('middleware path find', path);
      }
      if ((params = this.comparePath(path, req.parsedUrl.pathname))) {
        if (config?.DEBUG) {
          console.log('Yeaaa!!!');
          console.log('params', params);

          console.log('method', req.method);
          console.log('this.endpoints[path]', this.endpoints[path]);
          console.log('this.endpoints[path]?.[req.method]', this.endpoints[path]?.[req.method]);
        }

        const mustacheHandler = this.endpoints[path]?.[req.method];
        if (config?.DEBUG) {
          console.log('mustacheHandler', mustacheHandler);
          console.log('typeof mustacheHandler', typeof mustacheHandler);
          console.log(
            "(mustacheHandler && typeof mustacheHandler === 'function')",
            mustacheHandler && typeof mustacheHandler === 'function',
          );
        }
        if (mustacheHandler && typeof mustacheHandler === 'function') {
          req.params = params;
          if (config?.DEBUG) {
            console.log('mustacheHandler', mustacheHandler);
          }
          midFunc = mustacheHandler;
          return true;
        }
      }
      return false;
    });

    if (hasPath) {
      await midFunc(req, res);
      return;
    }
    next();
  }

  get(path, handler) {
    this.request('GET', path, handler);
  }

  post(path, handler) {
    this.request('POST', path, handler);
  }

  put(path, handler) {
    this.request('PUT', path, handler);
  }

  delete(path, handler) {
    this.request('DELETE', path, handler);
  }
};
