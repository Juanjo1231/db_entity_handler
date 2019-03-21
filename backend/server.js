const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const root = path.resolve(__dirname, '../')

app.use(express.static('./dist'))

app.get('/', (req, res) => {
  res.sendFile(root + '/index.html')
})

server.listen(3000, ev => {
  console.log('Listening at port 3000')
})
