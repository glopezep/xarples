import { DataTypes, Model } from 'sequelize'
import utils from '@xarples/utils'

import sequelize from '../lib/sequelize'

import Client from './client'

class AccessToken extends Model {
  id!: string
  clientId!: string
  userId!: string
  token?: string
  scope?: string
  readonly createdAt!: Date
  readonly updatedAt!: Date
}

AccessToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => utils.randomBytes(32)
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'access_tokens',
    underscored: true,
    hooks: {
      afterCreate(instance) {
        setTimeout(async () => {
          await instance.destroy()
        }, 1000 * 60 * 60) // 1h
      }
    }
  }
)

AccessToken.belongsTo(Client, {
  foreignKey: 'clientId',
  targetKey: 'id'
})

export default AccessToken
