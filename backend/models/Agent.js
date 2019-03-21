const config = require('../db/DBConfig.json')
const mysql = require('mysql')
const DBConnector = require('../db/DBConnector')
const validator = require('../../auxModules/FieldsValidation')
const conn = new DBConnector(config)


class Agent {
  constructor(user_data={}) {
    this.schema = {
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
    this.fields = validator(this.schema, user_data, err => { if(err) throw err })
    this.query = ''
  }
}
/**
 * Executes the this.query statement.
 */
Agent.prototype.executeQuery = function() {

}
/**
 * Saves agent in Database.
 * 
 * @param {DBConnector} connector Instance of DBConnector.
 */
Agent.prototype.saveInDB = function(connector) {
  let qFields = 'agents ('
  let qValues = 'VALUES ('
  let values = []

  for(let field in this.fields) {
    qFields += `${field}, `
    qValues += '?, '
    values.push( this.fields[field] )
  }

  qFields = qFields.substring(0, qFields.length-2) + ')'
  qValues = qValues.substring(0, qValues.length-2) + ')'

  this.query = `INSERT INTO ${qFields} ${qValues}`
  this.query = mysql.format(query, values)

  return connector.execute(this.query)
}
/**
 * Creates the beginning of a SELECT query with determined column names.
 */
Agent.prototype.select = function(...column_name) {
  let columns  = column_name
  let qColumns = ''
  // No columns provided.
  if(column_name.length === 0) {
    this.query = 'SELECT * FROM agents'
    console.log(this.query)
    return this
  }
  // Single parameter or Array.
  if(column_name.length === 1) {
    if(column_name[0].constructor === Array) {
      columns = column_name[0]
    }
  }
  // Build columns string.
  columns.forEach((col, i) => {
    let column = columns[i]
    if(column.constructor != String) {
      throw new Error(`Invalid argument of type ${typeof(column)} at position ${i}. Only strings are allowed.`)
    }

    qColumns += `${column}, `
  })
  // Removes extra comma at the end.
  qColumns = qColumns.substring(0, qColumns.length-2)

  this.query = `SELECT ${qColumns} FROM agents`
  
  return this
}

Agent.prototype.where = function(where_filters={}) {

}

let a1 = new Agent({
  first_name: 'Jose',
  last_name: 'Rivera',
  birthdate: new Date(1991, 11, 31),
  sex: false,
  email_address: 'email2@address.com',
  effective_hire_date: new Date(2014, 10, 21)
})

a1.getAll(conn)
  .then(res => {
    console.log(res)
  })
