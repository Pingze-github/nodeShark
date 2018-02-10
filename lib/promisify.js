
module.exports = promisify;

/**
 * 包装函数，返回Promise对象
 * @param fn
 * @param callbackErr
 * @param reverse
 * @returns {Function}
 */
function promisify(fn, callbackErr=true, reverse=false) {
  if ({}.toString.call(fn) !== '[object Function]') throw new TypeError('Only normal function can be promisified');
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = function (...args) {
        if (!callbackErr) {
          if (args.length === 1) return resolve(args[0]);
          return resolve(args);
        }
        const err = args.shift();
        const rest = args;
        if ({}.toString.call(err) === '[object Error]') return reject(err);
        if (rest.length === 1) return resolve(rest[0]);
        return resolve(rest);
      };
      try {
        if (reverse === true) fn.apply(null, [callback, ...args]);
        else fn.apply(null, [...args, callback]);
      } catch (err) {
        reject(err);
      }
    });
  }
}