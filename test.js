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


async function test2() {
  const request = require('./lib/request');
  request({
    method: 'POST',
    url: 'http://localhost:3000/test',
    proxy: 'http://127.0.0.1:8888',
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
      'Content-Type': 'application/json'
      // 'Content-Type': 'multipart/form-data'
      // 'content-type': 'text/plain'
    }
  })
    .then(res => {
      console.log('回复:', {
        status: res.statusCode,
        headers: res.headers,
        body: res.body,
      })
    })
    .catch(err => {
      console.error(err);
    });
}
test2();

async function test3() {

  const ERR_TYPES = {
    right: 0,
    not200: 1,
    errored: 2,
    timeout: 3
  };

  const DB = require('./lib/db');
  const db = DB({
    file: './lite.db'
  });
  await db.run('DROP TABLE IF EXISTS tbl_proxylog');
  await db.run(`CREATE TABLE IF NOT EXISTS tbl_proxylog (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    status INTEGER NOT NULL,
    error INTEGER NOT NULL
  )`);
  await db.run('INSERT INTO tbl_proxylog VALUES (NULL, ?, ?, ?)',
    ['http://www.baidu.com', 200, ERR_TYPES.right]);
  await db.run('INSERT INTO tbl_proxylog VALUES (NULL, ?, ?, ?)',
    ['http://localhost:3000/500', 500, ERR_TYPES.not200]);
  await db.bulkRun('INSERT INTO tbl_proxylog VALUES (NULL, ?, ?, ?)', [
    ['http://invalid', 0, ERR_TYPES.errored],
    ['http://timout', 0, ERR_TYPES.timeout],
  ]);
  const proxylogs = await db.all('SELECT * FROM tbl_proxylog');
  console.log(proxylogs);
}
// test3();
