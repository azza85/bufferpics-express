var express = require('express')
var app = express()
var port = process.env.PORT || 8888 // 8080
var needle = require('needle')

var configs = require('./config.js')
var config = new configs()

/**
 *
 * allow requests from another server
 *
 */
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}

var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(allowCrossDomain)

/**
 *
 * return buffer profile data
 *
 */
app.get('/api/buffer/profile', function (req, res) {
  var token = req.query.token || 0

  bufferappProfiles(token, bufferappProfiles_cb)
  function bufferappProfiles_cb (data) {
    res.contentType('application/json')
    var sendData = JSON.stringify(data)
    var sendReq = sendData
    var cb = req.query.callback
    console.log('profiles => data to return (%s)', sendData)
    sendReq = cb + '({"data":' + sendData + '})'
    res.send(sendReq)
  }
})

/**
 *
 * return buffer auth data.
 * NOTE: this is a GET request but inside the
 * function it calls a POST.
 *
 */
app.get('/api/buffer/auth', function (req, res) {
  var token = req.query.token || 0
  console.log('token', token)

  bufferappAuth(token, bufferappProfiles_cb)
  function bufferappProfiles_cb (data) {
    res.contentType('application/json')
    var sendData = JSON.stringify(data)
    var sendReq = sendData
    var cb = req.query.callback
    console.log('auth =>  data to return (%s)', sendData)
    sendReq = cb + '({"data":' + sendData + '})'
    res.send(sendReq)
  }
})

app.post('/api/buffer/update', function (req, res) {
  res.contentType('application/json')
  console.log('body', res.req.body)
  console.log('headers', res.req.headers.authorization)
  var sendData = JSON.stringify('aaa')
  var sendReq = sendData
  console.log('auth =>  data to return (%s)', sendData)
  // sendReq = '({"data":' + sendData + '})'
  res.send(sendReq)
})

// start the server
app.listen(port)
console.log('Server started!!! At http://localhost:' + port)

/**
 *
 * Get buffer app profile based on access token.
 * pass in token then run callback function to
 * return data
 *
 * @param {String} token
 * @return {Element} callback
 */

function bufferappProfiles (token, callback) {
  return needle.get(config.base_url + '/profiles.json?access_token=' + token, function (err, response) {
    if (err) {
      console.log('bufferappProfiles (%s)', JSON.stringify(err))
    }
    var body = response.body
    callback(body)
  })
}

/**
 *
 * Get buffer app auth based on temp code.
 * Success will return token to use for user
 * on other endpoints.
 *
 * @param {String} token
 * @return {Element} callback
 */
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
    if (err) {
      console.log('bufferappProfiles (%s)', JSON.stringify(err))
    }
    console.log(1114, data, response.body)
    var body = response.body
    callback(body)
  })
}

/**
 *
 * Buffer POST item
 *
 * @param {String} token
 * @return {Element} callback
 */

function bufferappPostItem (token, callback) {
  return needle.get(config.base_url + '/profiles.json?access_token=' + token, function (err, response) {
    if (err) {
      console.log('bufferappProfiles (%s)', JSON.stringify(err))
    }
    var body = response.body
    callback(body)
  })
}
