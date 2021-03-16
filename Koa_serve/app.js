const Koa = require('koa')
const app = new Koa()

const koaResponseDuration = require('./middleware/koa_response_duration')
app.use(koaResponseDuration)


const koaResponseHeader = require('./middleware/koa_response_header')
app.use(koaResponseHeader)

const koaResponseData = require('./middleware/koa_response_data')
app.use(koaResponseData)

// listen 用来启动一个http服务器
app.listen(8888)

const webSocketService = require('./service/web_socket_service')
webSocketService.listen()