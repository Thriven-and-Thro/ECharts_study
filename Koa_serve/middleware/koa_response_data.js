// 处理业务逻辑的中间件，读取某个json文件的数据
// 引入path模块
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  // 获取url
  const url = ctx.request.url

  // 获得输入的url进行拼接成文件路径
  let filePath = url.replace('/api', '')
  filePath = '../data' + filePath + '.json'
  filePath = path.join(__dirname, filePath)

  // 在file_utils.js中读取文件
  try {
    const ret = await fileUtils.getFileJsonData(filePath)
    ctx.response.body = ret
  } catch {
    // 处理一下报错
    const errorMsg = {
      message: '读取文件内容失败，文件资源不存在',
      status: 404
    }
    //  JavaScript 值转换为 JSON 字符串。
    ctx.response.body = JSON.stringify(errorMsg)
  }

  await next()
}