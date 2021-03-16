export default class SocketService {

  // 单例模式
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // socket对象
  ws = null
  // 存储回调函数
  callBackMapping = {}
  // 标识是否连接成功
  connected = false
  // 重试次数send
  sendRetryCount = 0
  // 重试次数onclose
  connectRectryCount = 0

  // 连接服务器的方法
  connect() {
    if (!window.WebSocket) {
      return console.log('该浏览器不支持');
    }
    this.ws = new WebSocket('ws://localhost:9998')
    // 成功
    this.ws.onopen = () => {
      console.log('连接成功');
      this.connected = true
      this.connectRectryCount = 0
    }
    // 失败
    this.ws.onclose = () => {
      console.log('error！！');
      this.connected = false
      // 重连
      this.connectRectryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRectryCount * 500)
    }
    // 得到数据
    this.ws.onmessage = msg => {
      console.log('成功获取数据');
      console.log(this.callBackMapping);
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        // 获取数据时
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
          // 获取全屏时
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, recvData)
          // 获取更换主题时
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  // 存储回调函数
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }
  // 销毁回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }
  // 发送数据的方法
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      // 重连
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}