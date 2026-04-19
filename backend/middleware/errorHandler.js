const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  console.error(`[Error] ${req.method} ${req.url} — ${status}: ${message}`)
  if (!IS_PROD) console.error(err.stack)

  res.status(status).json({
    error: message,
    ...(IS_PROD ? {} : { stack: err.stack }),
  })
}
