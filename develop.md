## 2.8
需要完成的核心函数:
```
/** 创建http代理服务器，有效地转发状态等
  * port 代理端口
  * cb 回调函数，参数为(req, _res)
  */
createHttpProxyServer(port, cb) {}

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

```
