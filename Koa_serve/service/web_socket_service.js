const path = require('path')
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')

const wss = new WebSocket.Server({
  port: 9998
})

module.exports.listen = () => {
  // 对客户端连接事件进行监听
  // client：客户端的连接socket对象
  wss.on('connection', client => {
    console.log('客户端连接成功！');
    // 对客户端的连接对象进行message事件监听
    // msg：客户端发给服务器的数据
    client.on('message', async msg => {
      console.log('收到数据：' + msg);
      //在接收服务器数据时一般是字符串。我们可以使用 JSON.parse() 方法将数据转换为 JavaScript 对象。
      let payload = JSON.parse(msg)
      // 
      const action = payload.action
      if (action === 'getData') {
        // 获取文件路径
        let filePath = '../data/' + payload.chartName + '.json'
        filePath = path.join(__dirname, filePath)
        // 读取文件
        const ret = await fileUtils.getFileJsonData(filePath)
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        wss.clients.forEach(client => {
          client.send(msg)
        })
      }
    })
  })
}