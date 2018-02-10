
const sqlite3 = require('sqlite3').verbose();
const promisify = require('./promisify');

module.exports = DB;

const METHOD_TO_PROMISIFY = ['close', 'run', 'get', 'all', 'each', 'exec', 'bulkRun'];

function DB(opts) {
  opts.file = opts.file || ':memory:';
  const db = new sqlite3.Database(opts.file);
  db.bulkRun = function(sql, paramsArr, cb) {
    try {
      const stmt = db.prepare(sql);
      for (let params of paramsArr) {
        stmt.run(params);
      }
      stmt.finalize(err => cb(err));
    } catch (err) {
      cb(err);
    }
  };
  METHOD_TO_PROMISIFY.forEach(method => {
    db[method] = promisify(db[method].bind(db));
  });
  return db;
}
