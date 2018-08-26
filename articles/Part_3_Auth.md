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

## Implmenting JWT

Let's talk about JWT for a second. Basically, the client will attempt to log in using some credientials, in our case a Steem username and password. Once we authenticate the user, using Steem.js, the server will generated a "JSON Web Token" using `jsonwebtoken`, which we installed earlier. We then send the token back to the client. On all subsequent requests, the client will include the token. If the token is successfully validated by the `jsonwebtoken`, the request is allowed. Our workflow wiill be something like this:

1. Client sends username/password to the server's `api/login` endpoint.
2. The server validates the login using `Steem.js`. 
3. If the credientials are correct, create a token and send it back, with any extra information.
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
