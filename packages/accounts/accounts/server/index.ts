import http from 'http'
import querystring from 'querystring'
import redis from 'redis'
import connectRedis from 'connect-redis'
import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import config from '@xarples/config'
import accounts from '@xarples/accounts-client'
import {
  logger,
  terminate,
  decodeBasic,
  isExpired,
  generateCodeChallenge
} from '@xarples/utils'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
import nuxtConfig from '../nuxt.config'
import auth from './auth'
import routes from './routes'

const RedisStore = connectRedis(expressSession)
const client = accounts.createClient()
const nuxt = new Nuxt(nuxtConfig)
const app = express()
const server = http.createServer(app)
const exitHandler = terminate(server)
const redisClient = redis.createClient({ host: config.shared.redis!.host })
const session = expressSession({
  store: new RedisStore({ client: redisClient }),
  secret: 'secret',
  saveUninitialized: false,
  resave: false
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session)
app.use(passport.initialize())
app.use(passport.session())

passport.use(auth.localStrategy)
passport.deserializeUser(auth.deserializeUser)
passport.serializeUser(auth.serializeUser)

app.use('/api', routes.api)

app.get('/authorize', (req, res) => {
  const {
    client_id: clientId,
    response_type: responseType,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod = 'plain'
  } = req.query

  if (!clientId || !responseType || !redirectUri || !codeChallenge) {
    return res.send(
      'Missing required parameter client_id, response_type, redirect_uri or code_challenge'
    )
  }

  if (!responseType.split(' ').includes('code')) {
    return res.send('response_type should be code')
  }

  if (!['S256', 'plain'].includes(codeChallengeMethod)) {
    return res.send('transform algorithm not supported')
  }

  const message = new accounts.messages.Client()

  message.setClientId(clientId)

  client.findOneClient(message, (err, found) => {
    if (err) {
      return res.send('Invalid client')
    }

    if (found.getRedirectUri() !== redirectUri) {
      return res.send('Invalid client')
    }

    if (!req.isAuthenticated()) {
      const queryParams = querystring.stringify(req.query)

      return res.redirect(`/signin?${queryParams}&redirect=/authorize`)
    }

    // @ts-ignore
    req.client = found.toObject()

    nuxt.render(req, res)
  })
})

app.post('/authorize', (req, res) => {
  const {
    consent,
    client_id: clientId,
    response_type: responseType,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod = 'plain',
    scope = '',
    state = undefined
  } = req.body

  if (!consent || consent !== 'allow') {
    const queryParams = querystring.stringify({
      error: 'access_denied',
      error_description:
        'The resource owner or authorization server denied the request.'
    })

    return res.redirect(`${redirectUri}?${queryParams}`)
  }

  if (!clientId || !responseType || !redirectUri || !codeChallenge) {
    return res.send({
      error: 'invalid_request',
      error_description:
        'Missing required parameter client_id, response_type, redirect_uri or code_challenge'
    })
  }

  if (!responseType.split(' ').includes('code')) {
    return res.send({
      error: 'unsupported_response_type',
      error_description: 'response_type should be code'
    })
  }

  if (!['S256', 'plain'].includes(codeChallengeMethod)) {
    return res.send({
      error: 'invalid_request',
      error_description: 'Transform algorithm not supported'
    })
  }

  const message = new accounts.messages.Client()

  message.setClientId(clientId)

  client.findOneClient(message, (err, found) => {
    if (err) {
      return res.send({
        error: 'invalid_request',
        error_description: err.message
      })
    }

    if (found.getRedirectUri() !== redirectUri) {
      return res.send({
        error: 'invalid_request',
        error_description: 'Invalid client'
      })
    }

    const message = new accounts.messages.AuthorizationCode()

    // @ts-ignore
    message.setUserId(req.user.id)
    message.setClientId(found.getId())
    message.setScope(scope)
    message.setCodeChallenge(codeChallenge)
    message.setCodeChallengeMethod(codeChallengeMethod)

    client.createAuthorizationCode(message, (err, result) => {
      if (err) {
        const queryParams = querystring.stringify({
          error: 'invalid_request',
          error_description: err.message
        })

        return res.redirect(`${redirectUri}?${queryParams}`)
      }

      const query = {
        code: result.getCode(),
        state
      }

      if (!state) {
        delete query.state
      }

      const queryParams = querystring.stringify(query)

      res.redirect(`${redirectUri}?${queryParams}`)
    })
  })
})

app.post('/token', (req, res) => {
  const {
    grant_type: grantType,
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  } = req.body

  if (!grantType || !code || !redirectUri || !clientId || !codeVerifier) {
    return res.status(400).send({
      error: 'invalid_request',
      error_description: 'Missing required params'
    })
  }

  const findClientMessage = new accounts.messages.Client()

  findClientMessage.setClientId(clientId)

  client.findOneClient(findClientMessage, async (err, clientResult) => {
    if (err) {
      res.status(400).send({
        error: 'invalid_request',
        error_description: 'Invalid client'
      })

      return
    }

    if (clientResult.getType() === 'confidential') {
      if (!req.headers.authorization) {
        res
          .status(401)
          .send({
            error: 'invalid_request',
            error_description: 'Missing required Authorization Header'
          })
          .setHeader('WWW-Authenticate', 'Basic')

        return
      }

      let isAuthenticated = false

      try {
        isAuthenticated = await authenticateClient(req.headers.authorization)
      } catch (error) {
        isAuthenticated = false
      }

      if (!isAuthenticated) {
        res
          .status(401)
          .send({
            error: 'invalid_client',
            error_description: 'Invalid client credentials'
          })
          .setHeader('WWW-Authenticate', 'Basic')

        return
      }
    }

    const findAuthorizationCodeMessage = new accounts.messages.AuthorizationCode()

    findAuthorizationCodeMessage.setCode(code)

    client.findOneAuthorizationCode(
      findAuthorizationCodeMessage,
      (err, authorizationCodeResult) => {
        if (err) {
          res.status(400).send({
            error: 'invalid_grant',
            error_description: 'Invalid authorization code'
          })

          return
        }

        if (authorizationCodeResult.getClientId() !== clientResult.getId()) {
          const destroyMessage = new accounts.messages.AuthorizationCode()

          destroyMessage.setCode(code)

          client.destroyAuthorizationCode(destroyMessage, () => {
            res.status(400).send({
              error: 'invalid_grant',
              error_description: 'Invalid authorization code'
            })
          })

          return
        }

        const isAuthorizationCodeExpired = isExpired({
          expiresIn: 60,
          entityCreatedAt: authorizationCodeResult.getCreatedAt()
        })

        if (isAuthorizationCodeExpired) {
          const destroyMessage = new accounts.messages.AuthorizationCode()

          destroyMessage.setCode(code)

          client.destroyAuthorizationCode(destroyMessage, () => {
            res.status(400).send({
              error: 'invalid_grant',
              error_description: 'Authorization code expired'
            })
          })

          return
        }

        const codeChallengeMethod = authorizationCodeResult.getCodeChallengeMethod()
        const codeChallenge = generateCodeChallenge(
          codeVerifier,
          // @ts-ignore
          codeChallengeMethod
        )

        if (authorizationCodeResult.getCodeChallenge() !== codeChallenge) {
          res.status(400).send({
            error: 'invalid_grant',
            error_description: 'Invalid code_verifier'
          })

          return
        }

        if (clientResult.getRedirectUri() !== redirectUri) {
          res.status(400).send({
            error: 'invalid_grant',
            error_description: 'Invalid redirect_uri'
          })

          return
        }

        const createAccessTokenMessage = new accounts.messages.AccessToken()

        // @ts-ignore
        createAccessTokenMessage.setUserId(authorizationCodeResult.getUserId())
        createAccessTokenMessage.setClientId(
          authorizationCodeResult.getClientId()
        )
        createAccessTokenMessage.setScope(authorizationCodeResult.getScope())

        const createRefreshTokenMessage = new accounts.messages.RefreshToken()

        // @ts-ignore
        createRefreshTokenMessage.setUserId(authorizationCodeResult.getUserId())
        createRefreshTokenMessage.setClientId(
          authorizationCodeResult.getClientId()
        )
        createRefreshTokenMessage.setScope(authorizationCodeResult.getScope())

        client.createAccessToken(createAccessTokenMessage, (_, accessToken) => {
          client.createRefreshToken(
            createRefreshTokenMessage,
            (_, refreshToken) => {
              res.send({
                access_token: accessToken.getToken(),
                token_type: 'Bearer',
                expires_in: 3600,
                refresh_token: refreshToken.getToken()
              })
            }
          )
        })
      }
    )
  })
})

app.use(nuxt.render)

async function main() {
  const { host, port } = config.accounts.frontend!

  await nuxt.ready()

  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  server.listen(port, () => {
    logger.info(`Server listening on http://${host}:${port}`)
  })

  process.on('SIGINT', exitHandler(0, 'SIGINT'))
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
}

if (!module.parent) {
  main()
}

export default app

function authenticateClient(encoded: string): Promise<boolean> {
  return new Promise(resolve => {
    const credentials = decodeBasic(encoded)

    if (!credentials) {
      return resolve(false)
    }

    const message = new accounts.messages.Client()

    message.setClientId(credentials.username)

    client.findOneClient(message, (err, result) => {
      if (err) {
        return resolve(false)
      }

      if (result.getClientSecret() !== credentials.password) {
        return resolve(false)
      }

      resolve(true)
    })
  })
}
