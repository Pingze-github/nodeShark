## 2.8
需要完成的核心函数:
```
/** 创建http代理服务器，有效地转发状态等
  * port 代理端口
  * cb 回调函数，参数为(req, _res)
  */
createHttpProxyServer(port, cb) {}node 

// 创建https代理服务器。应该能够做到和http代理同一端口，自动分发http和https
createHttpsProxyServer(port, cb) {}

/** 发送请求
  * contentType为枚举值，支持plain/form-data/x-www-form-urlencoded/json
  * 支持文件发送
  * opts.timeout
  * opts.method
  * opts.contentType
  * opts.url
  * opts.query
  * opts.body
  * opts.headers
  * @return res 
  */
async sendRequest(opts) {}

/** 数据库记录操作
  */
async getReqLogs() {}
async getReqLog() {}
async createReqLog(req) {}
async addReqLog(log) {}
async delReqLog() {}

// 设置局域网代理，至少对windows7有效，通过写注册表实现
async setLANProxy() {}
// 清除代理，程序关闭前应该调用
async resetLANProxy() {}

/** 写注册表
  * key 项(K) 绝对路径
  * valName 值名
  * valData 值数据
  * valType 值类型 枚举，缺省自动判断
  */
async writeRegistry(key, valName, valData, valType) {}

const REG_VAL_TYPE = {
  string: 'REG_SZ',
  mstring: 'REG_MULTI_SZ',
  estring: 'REG_EXPAND_SZ',
  bit32: 'REG_DWORD',
  bit64: 'REG_QWORD',
  binary: 'REG_BINARY',
}
```
