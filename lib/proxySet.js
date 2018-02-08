
const writeReg = require('./writeRegistry');

const InternetSettingKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';

module.exports = {
  setLANProxy,
  resetLANProxy
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