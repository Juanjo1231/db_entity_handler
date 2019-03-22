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

    this.schema = schema

    /*FieldsValidator(this.schema, agent_data, err => {
      this.throwError(err)
    })*/
  }
}

let a = new Agent()
a.select('first_name')
  .limit(5)
  .execute()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
