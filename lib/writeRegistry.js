
const childp = require('child_process');

const REG_VAL_TYPE = {
  string: 'REG_SZ',
  mstring: 'REG_MULTI_SZ',
  estring: 'REG_EXPAND_SZ',
  bit32: 'REG_DWORD',
  bit64: 'REG_QWORD',
  binary: 'REG_BINARY',
};

/**
 * 写注册表
 * @param key
 * @param valName
 * @param valData
 * @param valType
 * @returns {Promise<void>}
 */
function writeRegistry(key, valName, valData, valType) {
  if (!valType) {
    if (typeof valData === 'number') valType = REG_VAL_TYPE.bit32;
    else valType = REG_VAL_TYPE.string;
  }
  return new Promise((resolve, reject) => {
    const cmd = `reg add "${key}" /v ${valName} /t ${valType} /d "${valData}" /f`;
    childp.exec(cmd, (err, out) => {
      if (err) return reject(err);
      resolve(out);
    });
  });
}

module.exports = {
  write: writeRegistry,
  REG_VAL_TYPE
};