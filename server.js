var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var needle = require('needle')

var configs = require('./config.js')
var config = new configs()

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
}

var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })) // support encoded bodies
app.use(allowCrossDomain)

app.get('/api/buffer/profile', function (req, res) {
  var token = req.query.token || 0

  // bufferappProfiles(token, bufferappProfiles_cb)
  bufferappProfiles(token, bufferappProfiles_cb)
  function bufferappProfiles_cb (data) {
    res.contentType('application/json')
    var sendData = JSON.stringify(data)
    var sendReq = sendData
    var cb = req.query.callback
    console.log('obj', req.query.callback)
    // if(cb) {
    sendReq = cb + '({"data":' + sendData + '})'
    // }
    res.send(sendReq)
  }
})

app.get('/api/buffer/auth', function (req, res) {
  var token = req.query.token || 0

  // bufferappProfiles(token, bufferappProfiles_cb)
  bufferappAuth(token, bufferappProfiles_cb)
  function bufferappProfiles_cb (data) {
    res.contentType('application/json')
    var sendData = JSON.stringify(data)
    var sendReq = sendData
    var cb = req.query.callback
    console.log('obj', req.query.callback)
    // if(cb) {
    sendReq = cb + '({"data":' + sendData + '})'
    // }
    res.send(sendReq)
  }
})

// start the server
app.listen(port)
console.log('Server started!!! At http://localhost:' + port)

function bufferappProfiles (token, callback) {
  console.log('token', token)
  // return https.get('https://api.bufferapp.com/1/profiles.json?access_token=' + token, function (response) {})
  return needle.get(config.base_url + '/profiles.json?access_token=' + token, function (err, response) {
    var body = response.body
    callback(body)
  })
}

function bufferappAuth (token, callback) {
  var data = {
    grant_type: config.grant_type,
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uri: config.redirect_uri,
    code: token
  }
  var options = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }

  return needle.post(config.base_url + '/oauth2/token.json', data, options, function (err, response) {
    var body = response.body
    callback(body)
  })
}
