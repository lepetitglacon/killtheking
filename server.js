const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/dist/src/assets'))
app.use(express.static(__dirname + '/dist'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
