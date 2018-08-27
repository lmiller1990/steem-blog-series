This part of the series focused on authentication. In the previous article, I demonstrated how to post to the Steem blockchain by hardcoding your credentials. This time, we will create a login feature, so a user only needs to enter their initials once. This will be the first article to introduce a server, using Express for Node.js, and JWT (JSON Web Token) for authenication.

## Install the Server Dependencies

First, install `express`, the server framework we will be using, along with `jsonwebtoken` and `body-parser` by running `yarn add express jsonwebtoken body-parser --save`. Next, create a `server` directory inside `src`, and inside of `server` a `index.js`. This is where the server will run from. I also recommend installing `nodemon`, which automatically restarts the server after each change - otherwise you would have to manually kill and restart it. You can install `nodemon` globally by running `yarn global add nodemon`.

## Setting up the Express Backend

Before doing any work on the front end, let's set up JWT authentication. This is not an Node.js/Express tutorial, but it's fairly easy either way. If you need to, check some basic guides about Express first. I will, however, explain JWT authentication as we go.

I will be using `curl`, a command line tool that is available on Mac OS and Unix systems, but not Windows by default. You can install it for Windows, the site is [here](https://curl.haxx.se/download.html) and the several guides are [here](https://stackoverflow.com/questions/9507353/how-do-i-install-set-up-and-use-curl-on-windows).

In `src/server/index.js`, add the following minimal Express application:

```js
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())

app.post('/api/login', (req, res) => {
  res.sendStatus(403)
})

app.listen(5000, () => console.log('Listening on port 5000.'))
```

We create a single `/api/login` endpoint, which current returns 403 (forbidden status code) no matter what. Let's test it out, to make sure it's working. Run `nodemon src/server/index.js` in one terminal, and in another use the follow curl command:

```sh
curl http://localhost:5000/api/login \
  -X POST 
```

If everything went well, curl should have returned `Forbidden`. If not, check everything is typed correctly.

## Validating the User on the Server

Let's talk about JWT for a second. Basically, the client will attempt to log in using some credentials, in our case a Steem username and password. Once we authenticate the user, using Steem.js, the server will generated a "JSON Web Token" using `jsonwebtoken`, which we installed earlier. We then send the token back to the client. On all subsequent requests, the client will include the token. If the token is successfully validated by the `jsonwebtoken`, the request is allowed. Our workflow wiill be something like this:

1. Client sends username/password to the server's `api/login` endpoint.
2. The server validates the login using `Steem.js`. 
3. If the credentials are correct, create a token and send it back, with any extra information.
4. Now the client is "logged in". The client should resend the token each request to prove is it the authenticated user, and not a hacker/someone impersonating the real user's identity.

Let's update the `login` endpoint to achieve the second step above. There is a lot of new code - the explanation follows.

```js
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
```

There is a lot going on here. First, we extract the `username` and `password` from the request body. Next we use the `getAccounts` method (documentation [here](https://github.com/steemit/steem-js/tree/master/doc#get-accounts), which returns a bunch of public information about the account. We are interested in the posting public key. You can see the previous article for more details on what other fields are in this response.

Next, we get the private keys based on the `username` and `password` combination. Note that even if the username or password is wrong, the `getPrivateKeys` method still returns as public/private key combination - the will just be incorrect. Now we validate the two keys using `wifIsValid` (documentation [here](https://github.com/steemit/steem-js/tree/master/doc#wif-is-valid)). If the keys are a match, we return the original `username` - otherwise, the original `403 forbidden`. Note we still have not touched on the JSON Web Token - that will come next, once we make sure this is working.

Test it out using curl like this:

```sh
curl http://localhost:5000/api/login \
  -X POST \
  -d '{ "username": "your username", "password": "your password" }' \
  -H "Content-Type: application/json" \
```

Try your real password - you should get your username in the response. Next, change your password, and you should get the `403 forbidden` status.

## Implementing JWT

Now we can verify a user, the next step is to generate the JWT. Generating the token is extremely simple. Inside of `if (isValid)`, add the following:

```js
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
```

The documentation for `jwt.sign` is [here](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback). The first argument can be any payload - it is common to use a username or id. The second argument is a _secret key_ - this is something unique to your application, that you should not share. For this tutorial, I generated a random 16 digit hex number. You should never check this into source control or share it with anyone, or your server's security can be compromised.

Finally, the `token` is returned to the user. All subsequent requests (such as posting) will require this token to be sent from the client. Once the clienit has this token, however, they will not need to log in again until the token expires. You can set the expiry date in the third argument, an `options` object. This is in the documentation linked above.

Try running the `curl` command again now. If you supply a correct username/password combination, you should get a response like this:

```
{"token":"32JidGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey4142VybmFtZSI6InhlbmV0aWNzMTIzIiwiaWF0IjoxNTM1Mzc2MzI0fQ.4jp2LLAeDNUeUBHFFAs6vWhg1B6ftsI6ut7QRF3wdc4"}
```

This token is used for authencation. To see it in action, create another endpoint, `/api/posts`:

```js
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'ca214cc74cc32fafdca98b12e27663e8', (err, auth) => {
    if (err) res.sendStatus(403, { err })

    res.json({ auth })
  })
})
```

The match method for `json.sign` is `jwt.verify`. Using the token created eariler, and the secret key, it can determine if the token was originally received when the user successfully authenticated, or if it is a malicious party trying to compromise the application. 

You may have noticed we refer to `req.token` - this will be sent by the client. Also, we add a `verifyToken` middleware. Basically, before executing the `jwt.verify` logic, we will call `verifyToken`. This method will check if the client correctly included the JWT. It looks like this:

```js
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
```

The JWT has to be included in a specific format. The format is `Authorization: bearer [token]`. To get the token from the request, we first access the `bearer [token]` part using `req.headers['authorization']`. If it exists, we get the token part using `split`, and add it to the `request`. The `request` will then be passed on to the `app.post('/api/posts')` method. If the token is not present, we just return `403 Forbidden`.

To see if it works, run a new `curl` request that looks like this:

```sh
curl http://localhost:5000/api/posts \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [your key does here]"
```

We are posting to the `/api/posts` endpoint, with the correct token. If you did everything correctly, the response should look something like `{"auth":{"username":"xenetics123","iat":1535377462}}`. Notice we did NOT include our username or password, just the token - which requires the username and password to be created in the first place. This is just for a test - in the next part of the series, we will implement the logic to post to the Steem blockchain at `/api/posts`, and return a status to reflect the post was successful.

## Writing Tests for the Server Code

Now JWT authenication is working, let's finish up with some unit tests. First, a small tweak to `src/server/index.js` is needed to let us run the server on a different port to the main application, and easily restart it between tests. Update the part of `src/server/index.js` where the server is created:

```
function boot(port) {
  return app.listen(port, () => console.log(`Listening on port ${port}.`))
}

if (!module.parent) {
  boot(5000)
}

module.exports = { boot }
```

This way, the server will only run if there is no `module.parent` - basically, when it is not being required in another file.

Create a directory called `server` in `tests/unit/specs/server` and add a `index.spec.js` file. Before writing the actual tests, we have some housekeeping to do.

## Mocking steem.js

Testing is not the main purpose of this series, so I will not provide an in depth explanation of how exactly the tests are working. Trying things out yourself is the best way to learn. Either way, tests are part of any development workflow, so I'm going to go over them quickly anyway.

We _know_ steem.js and the functions it provides are working correctly - theyt have their own set of unit tests, written by the developers of the library. We want to test the our own code. That means we _mock_ the steem.js api - `getPrivateKeys`, `wifIsValid` and so forth. Jest allows us to mock a node module like so:

```js
const http = require('http')
const { boot } = require('../../../../src/server/index.js')

let mockWifIsValid = false

jest.mock('steem', function() {
  return {
    auth: {
      getPrivateKeys: () => ({ posting: 'mock' }),
      wifIsValid: () => mockWifIsValid
    },

    api: {
      getAccountsAsync: () => [{
        posting: { key_auths: [[ 'mock' ]] }
      }],
      setOptions: jest.fn()
    }
  }
})
```

We declared a global `mockWifIsValid` variable. This lets us simulate a correct or incorrect username/password combination by saying `mockWifIsValid = true` or `mockWifIsValid = false`. Now the actual tests - first one for the case of incorrect credentials:

```js
describe('server', () => {
  let server

  beforeEach(() => server = boot(4000))
  afterEach(() => server.close())

  describe('POST /api/login', () => {
    it('returns a 403 if username/password is invalid', (done) => {
      mockWifIsValid = false

      const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/login',
        method: 'POST'
      }
      const req = http.request(options, (res) => {
        res.setEncoding('utf8')
        res.on('data', () => {
          expect(res.statusCode).toBe(403)
          done()
        })
      })

      req.end()
    })
  })
})
```

Kind of long, but it's worth it to be confident the application is working correctly as we develop. `beforeEach` test, we start the server, and `afterEach` we close it. Then to simulate incorrect credentials, `mockWifIsValid` is set to `false`. After making the request using Node's `http` module, we `expect(res.statusCode).toBe(403)`.

Next, the passing case:

```js
it('returns a JWT if the username/password is valid', (done) => {
  mockWifIsValid = true

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/login',
    method: 'POST',
    headers: { 'content-type': 'application/json' }
  }
  const req = http.request(options, (res) => {
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      expect(JSON.parse(chunk)).toHaveProperty('token')
      done()
    })
  })

  req.write('{ "username": "test user" }')
  req.end()
})
```

We don't need to verify what the `token` is. As long as the `token` property is present in the response, I'm confident that the `jsonwebtoken` module is working correctly.

This test can be run individually using `yarn jest --runTestsByPath test/unit/spec/server/index.test.js`. If you did everything correctly, they should pass. Run the entire suite using `yarn unit`.
