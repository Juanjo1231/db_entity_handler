const mysql = require('mysql')
const chalk = require('chalk')

class DBEntityHandler {
  constructor(DBConfig, table_name, schema) {
    // Required fields for DB Connection.
    let required = ['host', 'port', 'database', 'user', 'password']
    for(let key in DBConfig) {
      if(!required.includes(key)) {
        let err = new Error(`Missing ${key} for Database connection.`)
        console.error( chalk.red(err.stack) )
      }
    }

    this.connection = mysql.createConnection(DBConfig)
    this.table_name = table_name
    this.schema     = schema
    this.query      = ''
  }
}
/**
 * Creates a SELECT query based on the columns provided with optional SQL function to
 * apply to the columns, all columns are retreived if no columns are provided.
 * 
 * @param {Object} [columns = {}] List of columns to retreive with optional SQL function.
 * @param {String} columns[i].f   SQL function to apply to the column.
 * 
 * @returns this
 */
DBEntityHandler.prototype.select = function(columns={}) {
  let len = Object.keys(columns).length
  let fields = []

  if(len === 0) {
    this.query = `SELECT * FROM ${this.table_name}`
    return this
  }

  for(let col_name in columns)
  {
    let col_set = columns[col_name]
    let field = col_name

    if(col_set.f) {
      field = `${col_set.f}(col_name)`
    }

    fields.push(field)
  }

  this.query = `SELECT ${fields.join(', ')} FROM ${this.table_name}`
  return this
}
/**
 * Creates a SELECT query with TOP n values.
 * 
 * @param {Number} top          Amount of records to retreive.
 * @param {Object} [columns={}] List of columns to retreive with optional SQL function.
 * 
 * @returns this
 */
DBEntityHandler.prototype.selectTop = function(top, columns={}) {
  if(top.constructor != Number || top <= 0) {
    let err =  new Error(`Invalid value ${top} for 'TOP' clause. Only an integer greater than 0 is allowed.`)
    console.error( chalk.red(err.stack) )
  }
  this.select(columns)
  this.query = `SELECT TOP ${top} ${this.query.substr(7)}`
  return this
}
/**
 * Create a SELECT query with the DISTINCT clause.
 * 
 * @param {Object} [columns={}] List of columns to retreive with optional SQL function.
 * 
 * @returns this
 */
DBEntityHandler.prototype.selectDistinct = function(columns={}) {
  this.select(columns)
  this.query = `SELECT DISTINCT ${this.query.substr(7)}`
  return this
}

DBEntityHandler.prototype.where = function(conditions) {
  // Not conditions provided.
  if(!conditions || Object.keys(conditions).length === 0) return this
  // Remove all after 'WHERE' if already exists in the query.
  let whereIndex = this.query.indexOf('WHERE')
  if(whereIndex != -1) {
    this.query = this.query.substring(0, whereIndex-1)
  }

  this.query += ' WHERE '

  for(let field in conditions) {
    if(!this.schema[field]) {
      let error = new Error(`Invalid column name: ${field}. It does not exists in the entity schema.`)
      console.error( chalk.red(error.stack) )
    }

    let condition = conditions[field]
    this.query += field + condition
  }

  console.log( chalk.cyan(this.query) )
}

DBEntityHandler.prototype.orderBy = function(columns={}) {}

DBEntityHandler.prototype.groupBy = function(columns={}) {}

DBEntityHandler.prototype.insert = function(values={}) {}


const config = require('../db/DBConfig.json')

let hd = new DBEntityHandler(config, 'agents', {
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
})

hd.selectDistinct({col: {f: 'count'}, col1: {f: 'sum'}, col2: ''})
  .where({first_name: "='algo'"})
