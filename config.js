var configs = function () {
  var config = {
    'grant_type': 'authorization_code',
    'client_id': 'CLIENT_ID',
    'client_secret': 'CLIENT_SECRET',
    'redirect_uri': 'REDIRECT_URI',
    'base_url': 'https://api.bufferapp.com/1'
  }
  return config
}

module.exports = configs
