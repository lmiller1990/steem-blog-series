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
})
