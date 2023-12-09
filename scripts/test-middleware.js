const applyMiddleware = (mainFn, ...middlewares) => {
  return middlewares.reduceRight((next, middleware, index) => {
    return () => middleware(next);
  }, mainFn);
};

const middleware1 = (next) => {
  console.log("middleware1");
  next();
};

const middleware2 = (next) => {
  console.log("middleware2");
  next();
};

const mainFn = () => {
  console.log("mainFn");
};

const result = applyMiddleware(mainFn, middleware1, middleware2);
result();
