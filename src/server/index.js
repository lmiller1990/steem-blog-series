const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const steem = require('steem')

const app = express()
app.use(bodyParser.json())
steem.api.setOptions({ url: 'https://api.steemit.com' })


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
    res.json({ username })
  } else {
    res.sendStatus(403)
  }
})

app.listen(5000, () => console.log('Listening on port 5000.'))


  /*
app.post('/api/login', (req, res) => {
  // Steem
  console.log(req.token)
  const user = {
    id: 1,
    username: 'lachlan'
  }

  jwt.sign({ user }, 'mysecret', (err, token) => {
    res.json({ token })
  })
})

app.post('/api/posts', verifyToken, (req, res) => {
  console.log('here')
  jwt.verify(req.token, 'mysecret', (err, auth) => {
    if (err) {
      console.log('err', err)
      res.sendStatus(403, { err })
    } else {
      console.log('ok!!!!')
      res.json({
        msg: 'ok!',
        auth
      })
    }
  })
})

// FORMAT
// Authorization: Bearer <access_token>
//

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']

  // check if bearer not defined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]

    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }

}

app.listen(5000, () => console.log('Listening on port 5000'))*/
