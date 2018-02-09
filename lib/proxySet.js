
const writeReg = require('./writeRegistry');

const InternetSettingKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';

module.exports = {
  setLANProxy,
  resetLANProxy,
  reopenIE
};

/**
 * 设置局域网代理
 * @param args
 * @returns {Promise<*>}
 */
async function setLANProxy(...args) {
  if (process.platform === 'win32') return setLANProxyWin(...args);
  else return false;
}

/**
 * 重置局域网代理
 * @param args
 * @returns {Promise<*>}
 */
async function resetLANProxy(...args) {
  if (process.platform === 'win32') return resetLANProxyWin(...args);
  else return false;
}


/**
 * Windows设置局域网代理
 * @param port
 * @param protocols
 * @returns {Promise<boolean>}
 */
async function setLANProxyWin(port, protocols) {
  try {
    let serverStr = '';
    protocols.forEach(p => serverStr += `${p}=127.0.0.1:${port};`);
    const promises = [];
    promises.push(writeReg.write(InternetSettingKey, 'ProxyEnable', 1));
    promises.push(writeReg.write(InternetSettingKey, 'ProxyServer', serverStr));
    for (let promise of promises) await promise;
    // TODO 需要刷新设置，使其生效
    // 目前已知，打开ie就会刷新设置
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Windows重置局域网代理
 * @returns {Promise<boolean>}
 */
async function resetLANProxyWin() {
  try {
    const promises = [];
    promises.push(writeReg.write(InternetSettingKey, 'ProxyEnable', 0));
    promises.push(writeReg.write(InternetSettingKey, 'ProxyServer', ''));
    for (let promise of promises) await promise;
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 通过重启动ie的方式，使proxy配置更改生效
 * @returns {Promise<void>}
 */
async function reopenIE() {
  try {
    await stopIE();
  } catch (e) {
    console.error('关闭IE错误', e);
  }
  startIE().catch(e => console.error('启动IE错误', e));
  setTimeout(() => {
    stopIE();
  }, 100);
}

function stopIE() {
  return new Promise((resolve, reject) => {
    require('child_process').exec('taskkill /im iexplore.exe -f', (err) => {
      if (err) {
        if (err.code === 128) return resolve(true);
        return reject(err);
      }
      resolve(true);
    })
  });
}

function startIE() {
  return new Promise((resolve, reject) => {
    require('child_process').exec('"C:\\Program Files\\Internet Explorer\\iexplore.exe"', (err) => {
      if (err) {
        if (err.code === 1) return resolve(true);
        return reject(err);
      }
      resolve(true);
    })
  });
}