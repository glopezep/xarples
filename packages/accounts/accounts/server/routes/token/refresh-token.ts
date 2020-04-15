import { promisify } from 'util'
import express from 'express'
import accounts from '@xarples/accounts-client'
import {
  AccessToken,
  RefreshToken
} from '@xarples/accounts-protos/generated/account_pb'
import { decodeBasic } from '@xarples/utils'

import auth from '../../auth'

const client = accounts.createClient()
const router = express.Router()

const findRefreshToken = promisify<RefreshToken, RefreshToken>(
  client.findOneRefreshToken
).bind(client)
const createAccessToken = promisify<AccessToken, AccessToken>(
  client.createAccessToken
).bind(client)

router.post('/', async (req, res, next) => {
  try {
    const {
      grant_type: grantType,
      refresh_token: refreshToken,
      scope = ''
    } = req.body

    if (!grantType || !refreshToken) {
      return res.status(400).send({
        error: 'invalid_request',
        error_description:
          'Missing required parameter grant_type or refresh_token'
      })
    }

    if (grantType !== 'refresh_token') {
      next()
    }

    const findRefreshTokenMessage = new accounts.messages.RefreshToken()

    findRefreshTokenMessage.setToken(refreshToken)

    const foundRefreshToken = await findRefreshToken(findRefreshTokenMessage)
    const foundClient = foundRefreshToken.getClient()

    if (foundClient?.getType() === 'confidential') {
      if (!req.headers.authorization) {
        res
          .status(401)
          .send({
            error: 'invalid_client',
            error_description: 'Missing required Authorization Header'
          })
          .setHeader('WWW-Authenticate', 'Basic')

        return
      }

      let isAuthenticated = false

      try {
        isAuthenticated = await auth.authenticateClient(
          req.headers.authorization
        )
      } catch (error) {
        isAuthenticated = false
      }

      if (!isAuthenticated) {
        return res
          .status(401)
          .send({
            error: 'invalid_client',
            error_description: 'Invalid client credentials'
          })
          .setHeader('WWW-Authenticate', 'Basic')
      }

      const credentials = decodeBasic(req.headers.authorization!)

      if (foundClient.getClientId() !== credentials!.username) {
        return res.status(400).send({
          error: 'invalid_client',
          error_description: 'Invalid client'
        })
      }
    }

    const createAccessTokenMessage = new accounts.messages.AccessToken()

    createAccessTokenMessage.setUserId(foundClient!.getUserId())
    createAccessTokenMessage.setClientId(foundClient!.getClientId())
    createAccessTokenMessage.setScope(scope)

    const accessToken = await createAccessToken(createAccessTokenMessage)

    res.status(200).send({
      access_token: accessToken.getToken(),
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 3600
    })
  } catch (error) {
    if (error.message.match(/client not found/)) {
      res.status(400).send({
        error: 'invalid_request',
        error_description: 'Invalid client'
      })
    }

    if (error.message.match(/refresh token not found/)) {
      res.status(400).send({
        error: 'invalid_grant',
        error_description: 'Invalid refresh token'
      })
    }

    res.status(500).send({
      error: 'server_error',
      error_description: error.message
    })
  }
})

export default router
