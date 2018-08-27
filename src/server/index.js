const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const steem = require('steem')

const app = express()
app.use(bodyParser.json())
steem.api.setOptions({ url: 'https://api.steemit.com' })

function verifyToken(req, res, next) {
  // 
  // Get auth header value
  //
  const bearerHeader = req.headers['authorization']

  //
  // check if bearer not defined
  // Payload looks like this:
  // Authorization: bearer xxxxxxxxxxxx
  //
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    req.token = bearer[1]
    next()
  } else {
    res.sendStatus(403)
  }
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body 

  // get posting public key
  const account = await steem.api.getAccountsAsync([ username ])
  const pubKey = account[0].posting.key_auths[0][0]

  // 
  // for a given username/password combo,
  // response contains { posting: 'private key', postingPubkey: 'pub key' }
  // 
  const { posting } = steem.auth.getPrivateKeys(username, password, ['posting'])
  //
  // See if the private key is a match to the public key
  const isValid = steem.auth.wifIsValid(posting, pubKey)

  if (isValid) {
    // 
    // Sign the JWT
    //
    jwt.sign({ username }, 'ca214cc74cc32fafdca98b12e27663e8', (err, token) => {
      if (err) throw err

      res.json({ token })
    })
   
  } else {
    res.sendStatus(403)
  }
})

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'ca214cc74cc32fafdca98b12e27663e8', (err, auth) => {
    if (err) res.sendStatus(403, { err })

    res.json({ auth })
  })
})


function boot(port) {
  return app.listen(port, () => console.log(`Listening on port ${port}.`))
}

if (!module.parent) {
  boot(5000)
}

module.exports = { boot }
