process.on('unhandledRejection', rej => console.error(rej));

const writeReg = require('./lib/writeRegistry');

// writeReg.write('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
//   'ProxyEnable', 0)
//   .then(ret => console.log(ret));

const proxySet = require('./lib/proxySet');

~async function(){
  console.log(await proxySet.setLANProxy(8888, ['http', 'https']));
  // console.log(await proxySet.resetLANProxy());
}();

// 代理服务器
const proxyServer = require('./lib/proxyServer');

httpProxyServer = proxyServer.createHttpProxyServer((err, req, res) => {
  if (err) return console.warn('代理错误', err);
  console.log(req.url, res.statusCode, res.body.length);
});
httpProxyServer.listen(8888, () => {
  console.log('http proxy server running @ 8888')
});
