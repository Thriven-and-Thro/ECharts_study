// 设置响应头的中间件
module.exports = async (ctx, next) => {
  // 设置MIME类型
  const contentType = 'application/json;charset=utf-8'
  // 设置响应头
  ctx.set('Content-Type', contentType)
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-control-Allow-Methods", "OPTIONS,GET,PUT,POST, DELETE")
  await next()
}