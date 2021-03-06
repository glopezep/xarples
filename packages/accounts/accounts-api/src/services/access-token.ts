import grpc from 'grpc'
import { AccessToken, User, Client } from '@xarples/accounts-db'
import { messages } from '@xarples/accounts-protos'
import { logger, cache as getCache } from '@xarples/utils'

import {
  getAccessTokenMessage as getMessage,
  getAccessTokenListMessage as getMessageList
} from '../utils'

const cache = getCache<string, AccessToken | AccessToken[]>({
  maxAge: 1000 * 60 * 60 // 1 hour
})

export async function createAccessToken(
  call: grpc.ServerUnaryCall<messages.AccessToken>,
  callback: grpc.sendUnaryData<messages.AccessToken>
) {
  try {
    const data = call.request.toObject()

    delete data.id
    delete data.token

    logger.info(`Creating access token in the database`)
    logger.debug('data', data)

    const created = await AccessToken.create(data, { include: [User, Client] })

    await created.reload()

    const message = getMessage(created)

    logger.info(`Creating access token with id ${created.id} in the cache`)

    cache.set(created.id, created)

    callback(null, message)
  } catch (e) {
    logger.error(e.message)
    logger.debug(e.stack)
    callback(e, null)
  }
}

export async function findOneAccessToken(
  call: grpc.ServerUnaryCall<messages.AccessToken>,
  callback: grpc.sendUnaryData<messages.AccessToken>
) {
  try {
    const token = call.request.getToken()

    if (!cache.has(token)) {
      const found = await AccessToken.findOne({
        where: { token },
        include: [User, Client]
      })

      logger.info(`Fetching access token with token ${token} from database`)

      if (!found) {
        const error: grpc.ServiceError = {
          name: '',
          message: `access token not found`,
          code: grpc.status.NOT_FOUND
        }

        logger.error(
          `Can't find access token with token ${token} from the database`
        )

        callback(error, null)

        return
      }

      logger.info(`Creating access token with token ${token} in the cache`)

      cache.set(found.token!, found)
    }

    logger.info(`Fetching access token with token ${token} from the cache`)

    const found = cache.get(token) as AccessToken
    const message = getMessage(found)

    callback(null, message)
  } catch (e) {
    logger.error(e.message)
    logger.debug(e.stack)
    callback(e, null)
  }
}

export async function findAllAccessToken(
  call: grpc.ServerUnaryCall<messages.AccessTokenList>,
  callback: grpc.sendUnaryData<messages.AccessTokenList>
) {
  try {
    call.request.toObject()

    if (!cache.has('foundList')) {
      logger.info(`Fetching access token list from the database`)

      const foundList = await AccessToken.findAll({ raw: true })

      logger.info(`Creating access token in the cache`)

      cache.set('foundList', foundList)
    }

    logger.info(`Fetching access token list from the cache`)

    const foundList = cache.get('foundList') as AccessToken[]
    const message = getMessageList(foundList)

    callback(null, message)
  } catch (e) {
    logger.error(e.message)
    logger.debug(e.stack)
    callback(e, null)
  }
}
// export async function updateAccessToken(
//   call: grpc.ServerUnaryCall<messages.AccessToken>,
//   callback: grpc.sendUnaryData<messages.AccessToken>
// ) {
//   try {
//     const id = call.request.getId()

//     logger.info(`Fetching access token with id ${id} from the database`)

//     const data = call.request.toObject()
//     const found = await AccessToken.findByPk(id)

//     delete data.id

//     if (!found) {
//       const error: grpc.ServiceError = {
//         name: '',
//         message: `access token not found`,
//         code: grpc.status.NOT_FOUND
//       }

//       logger.error(`Can't find access token with id ${id} from the database`)

//       callback(error, null)

//       return
//     }

//     logger.info(`Updating access token with id ${id} from the database`)
//     logger.debug('data', data)

//     const updated = await found.update(data)
//     const message = getMessage(updated)

//     logger.info(`Updating access token with id ${id} from the cache`)

//     cache.set(updated.id, updated)

//     logger.info(`Invalidating the access token list of the cache`)

//     cache.del('foundList')

//     callback(null, message)
//   } catch (e) {
//     logger.error(e.message)
//     logger.debug(e.stack)
//     callback(e, null)
//   }
// }
export async function destroyAccessToken(
  call: grpc.ServerUnaryCall<messages.AccessToken>,
  callback: grpc.sendUnaryData<messages.AccessToken>
) {
  try {
    const token = call.request.getToken()

    logger.info(`Fetching access token with token ${token} from the database`)

    const found = await AccessToken.findOne({
      where: { token },
      include: [User, Client]
    })

    if (!found) {
      const error: grpc.ServiceError = {
        name: '',
        message: `access token not found`,
        code: grpc.status.NOT_FOUND
      }

      logger.error(
        `Can't find access token with token ${token} from the database`
      )

      callback(error, null)

      return
    }

    const clone = JSON.parse(JSON.stringify(found)) as AccessToken

    logger.info(`Deleting access token with token ${token} from the database`)

    await found.destroy()

    logger.info(`Deleting access token with token ${token} from the cache`)

    cache.del(clone.token!)

    logger.info(`Invalidating the accessToken list of the cache`)

    cache.del('foundList')

    const message = getMessage(clone)

    callback(null, message)
  } catch (e) {
    logger.error(e.message)
    logger.debug(e.stack)
    callback(e, null)
  }
}
