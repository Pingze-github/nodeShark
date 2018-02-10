
const http = require('http');
const URL = require('url');
const querystring = require('querystring');
const FormData = require('form-data');
const File = require('./file');

const promisify = require('./promisify');

module.exports = promisify(request);

/**
 * 发起请求，封装http.request
 * @param opts
 * @param cb
 */
function request(opts, cb) {

  opts = optsDefault(opts);

  opts.url += '?' + querystring.stringify(opts.query);

  let postData = '';
  if (!['GET', 'HEAD'].includes(opts.method)) {
    if (opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      postData = querystring.stringify(opts.body);
      opts.headers['Content-Length'] = Buffer.byteLength(postData);
    } else if (opts.headers['Content-Type'] === 'application/json') {
      postData = JSON.stringify(opts.body);
      opts.headers['Content-Length'] = Buffer.byteLength(postData);
    } else if (opts.headers['Content-Type'] === 'multipart/form-data') {
      postData = new FormData();
      for (let [key, val] of Object.entries(opts.body)) {
        if (val instanceof File) postData.append(key, val.buffer, {filename: val.name});
        else postData.append(key, val);
      }
      const formHeaders = postData.getHeaders();
      //content-disposition [ 'form-data; name="a"; filename="50kqujndzxssdbzsuec4ra==.png"' ];
      if (formHeaders['content-type']) formHeaders['Content-Type'] = formHeaders['content-type'];
      opts.headers = Object.assign(opts.headers, formHeaders);
    } else if (opts.headers['Content-Type'] === 'text/plain') {
      postData = opts.body.toString();
      opts.headers['Content-Length'] = Buffer.byteLength(postData);
    }
  }


  const {hostname, port, path} = URL.parse(opts.url);
  console.log(opts);
  console.log({hostname, port, path});

  let chunks = new Buffer('');
  const req = http.request({
    // FIXME 超时无效
    timeout: opts.timeout,
    method: opts.method,
    hostname,
    port,
    path,
    headers: opts.headers
  }, function (res) {
    res.on('data', chunk => {
      chunks = Buffer.concat([chunks, chunk]);
    });
    res.on('end', () => {
      res.body = chunks.toString();
      return cb(null, res);
    });
  });
  req.on('error', err => {
    if (cb) cb(err)
  });
  if (!['GET', 'HEAD'].includes(opts.method)) {
    if (opts.headers['Content-Type'].startsWith('multipart/form-data')) {
      postData.pipe(req);
    } else {
      req.write(postData);
    }
  }
  req.end();
  setTimeout(() => {

  }, opts.timeout);
}

function optsDefault(opts) {
  opts.method = opts.method || 'GET';
  opts.url = opts.uri || opts.url;
  if (!opts.url) throw new Error('Missing param opts.url');
  opts.timeout = opts.timeout || 3000;
  opts.headers = opts.headers || {};
  opts.headers['User-Agent'] = opts.headers['user-agent'] || opts.headers['User-Agent'] || 'nodeShark-0.0.1';
  opts.headers['Content-Type'] = opts.headers['content-type'] || opts.headers['Content-Type'] || 'application/x-www-form-urlencoded';
  opts.query = opts.query || {};
  opts.body = opts.body || (opts.headers['Content-Type'] === 'text/plain' ? '' : {});
  return opts;
}
