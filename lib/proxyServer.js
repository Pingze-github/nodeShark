
const http = require('http');
const URL = require('url');

module.exports = {
  createHttpProxyServer
};

/**
 * 创建http代理服务器
 * @param cb
 * @returns {*}
 */
function createHttpProxyServer(cb) {
  return http.createServer((req, res) => {
    return request(req.url, (err, _res) => {
      if (err) {
        if (cb) cb(err, req);
        return res.end();
      }
      cb(null, req, _res);
      return resDealer(res, _res);
    });
  });
}

/**
 * 处理返回
 * @param res
 * @param _res
 */
function resDealer(res, _res) {
  console.log(_res.headers)
  res.writeHead(_res.statusCode, _res.headers);
  return res.end(_res.body);
}

/**
 * 发起请求，封装http.request
 * @param url
 * @param cb
 */
function request(url, cb) {
  const {hostname, port, path} = URL.parse(url);
  let chunks = new Buffer('');
  const req = http.request({hostname, port, path}, function (res) {
    res.on('data', chunk => {
      chunks = Buffer.concat([chunks, chunk]);
    });
    res.on('end', () => {
      res.body = chunks.toString();
      return cb(null, res);
    })
  });
  req.on('error', err => {
    if (cb) cb(err)
  });
  req.end();
}