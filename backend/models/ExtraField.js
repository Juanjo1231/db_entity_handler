const DBEntityHandler = require('./DBEntityHandler')
const DBConfig = require('../db/DBConfig.json')
const FieldsValidator = require('../../auxModules/FieldsValidator')
const Agent = require('./Agent')

class ExtraField extends DBEntityHandler {
  constructor(field_data={}) {
    let schema = {
      agent_id: {
        type: Number,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
    super(DBConfig, 'extra_fields', schema)

    this.schema    = schema
    this.values    = field_data
    this.tableName = 'extra_fields'

    FieldsValidator(this.schema, this.values, err => {
      throw err
    })
  }

  saveInDB() {
    return new Promise((resolve, reject) => {
      this.insert(this.tableName, this.values).then(result => {
      if(result.insertId) {
        this.id = result.insertId
      }
      resolve(result)
      }).catch(err => {reject(err)})
    })
  }

  static saveInDB(table_name, values) {
    return new Promise((resolve, reject) => {
      this.insert(table_name, values).then(result => {
      if(result.insertId) {
        this.id = result.insertId
      }
      resolve(result)
      }).catch(err => {reject(err)})
    })
  }
}

module.exports = ExtraField
