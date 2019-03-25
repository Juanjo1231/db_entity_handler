const DBEntityHandler = require('./DBEntityHandler')
const DBConfig = require('../db/DBConfig.json')
const FieldsValidator = require('../../auxModules/FieldsValidator')

class Agent extends DBEntityHandler {
  constructor(agent_data={}) {
    let schema = {
      active: {type: Boolean, default: true},
      first_name: {type: String, required: true},
      other_names: String,
      last_name: {type: String, required: true},
      other_surnames: String,
      birthdate: {type: Date, required: true},
      sex: {type: Boolean, required: true},
      part_time: {type: Boolean, default: false},
      temp: {type: Boolean, default: false},
      rehirable: Boolean,
      emergency_contact: String,
      emergency_phone: String,
      email_address: {type: String, required: true},
      effective_hire_date: {type: Date, required: true},
      termination_date: Date,
      termination_type: Boolean,
      termination_comments: String
    }
    super(DBConfig, 'agents', schema)

    this.schema    = schema
    this.values    = agent_data
    this.tableName = 'agents'

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

module.exports = Agent
