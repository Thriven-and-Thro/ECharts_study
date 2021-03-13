// 读取文件的工具方法
// 引入node.js内置文件系统模块
const fs = require('fs')
module.exports.getFileJsonData = (filePath) => {
  // 读取文件内容
  // 异步不能return，需包裹在一个promise中
  return new Promise((resolve, reject) => {
    // 读取文件的方法
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}