const config = require('./utils/config')
const logger = require('./utils/logger')

const express = require('express')
const path = require('path')

const app = require('./app')

app.use(express.json())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() })
})

// serve the built Vite frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = config.PORT || 3003
app.listen(PORT, () => logger.info(`server running on port ${PORT}`))