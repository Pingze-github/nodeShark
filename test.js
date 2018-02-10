process.on('unhandledRejection', rej => console.error(rej));

const File = require(('./lib/file'));
const writeReg = require('./lib/writeRegistry');

// writeReg.write('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
//   'ProxyEnable', 0)
//   .then(ret => console.log(ret));

const proxySet = require('./lib/proxySet');

// ~async function(){
//   console.log(await proxySet.setLANProxy(8888, ['http', 'https']));
//   console.log(await proxySet.resetLANProxy());
//   // 不是很好的办法
//   proxySet.reopenIE();
// }();
//
// ~async function () {
//   // 代理服务器
//   const proxyServer = require('./lib/proxyServer');
//
//   httpProxyServer = proxyServer.createHttpProxyServer((err, req, res) => {
//     if (err) return console.warn('代理错误', err);
//     console.log(req.url, res.statusCode, res.body.length);
//   });
//   httpProxyServer.listen(8888, () => {
//     console.log('http proxy server running @ 8888')
//   });
// }();


~async function () {
  const request = require('./lib/request');
  request({
    method: 'POST',
    url: 'http://localhost:3000/test',
    timeout: 3000,
    query: {
      a: 1,
      b: 2
    },
    body: {
      c: 3,
      d: 4,
      // e: new Buffer('我吃西红柿'),
      'f': new File('./.gitignore'),
    },
    headers: {
      'Content-Type': 'multipart/form-data'
      // 'content-type': 'text/plain'
    }
  })
    .then(res => {
      console.log('RESPONSE', {
        status: res.statusCode,
        headers: res.headers
      })
    })
    .catch(err => {
      console.error(err);
    });
}();

