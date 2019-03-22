const mysql = require('mysql')
const chalk = require('chalk')
const DBEntityHandlerErrors = {
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_PARAM_TYPE: 'INVALID_PARAM_TYPE'
}


class DBEntityHandler {
  constructor(DBConfig, table_name, schema) {
    // Required fields for DB Connection.
    let required = ['host', 'port', 'database', 'user', 'password']
    required.forEach(key => {
      if(!DBConfig[key]) {
        let err = new Error(`Missing ${key} for Database connection.`)
        console.error( chalk.red(err.stack) )
      }
    })

    this.connection = mysql.createConnection(DBConfig)
    this.table_name = table_name
    this.schema     = schema
    this.query      = ''
  }
}
/**
 * Throws an error in color red.
 */
DBEntityHandler.prototype.throwError = function(msg) {
  let error = msg.constructor === Error ? msg : new Error(msg)
  throw chalk.red(error.stack)
}
/**
 * Creates a SELECT query based on the columns provided with optional SQL function to
 * apply to the columns, all columns are retreived if no columns are provided.
 * 
 * @param {Object} [columns = {}] List of columns to retreive with optional SQL function.
 * @param {String} columns[i].f   SQL function to apply to the column.
 * 
 * @returns self
 */
DBEntityHandler.prototype.select = function(...columns) {
  // JSON or Array provided as the only param.
  if(columns[0].constructor === Array || columns[0].constructor === Object) {
    columns[0] = columns
  }
  let fields = []

  if(columns.length === 0) {
    this.query = `SELECT * FROM ${this.table_name}`
    return this
  }

  for(let col_name in columns)
  {
    let col_set = columns[col_name]
    let field = isNaN(col_name) ? col_name : columns[col_name]

    if(col_set.f) {
      field = `${col_set.f}(${field})`
      if(col_set.as) {
        field += ` AS ${col_set.as}`
      } 
    }

    fields.push(field)
  }

  this.query = `SELECT ${fields.join(', ')} FROM ${this.table_name}`
  return this
}
/**
 * Create a SELECT query with the DISTINCT clause.
 * 
 * @param {Object} [columns={}] List of columns to retreive with optional SQL function.
 * 
 * @returns self
 */
DBEntityHandler.prototype.selectDistinct = function(columns={}) {
  this.select(columns)
  this.query = `SELECT DISTINCT ${this.query.substr(7)}`
  return this
}
/**
 * Builds a WHERE statement based on the conditions provided.
 * 
 * @param {Object} conditions Conditions to apply to the query.
 * 
 * @returns self
 */
DBEntityHandler.prototype.where = function(conditions) {
  // Not conditions provided.
  if(!conditions || Object.keys(conditions).length === 0) return this
  // Remove all after 'WHERE' if already exists in the query.
  let whereIndex = this.query.indexOf('WHERE')
  if(whereIndex != -1) {
    this.query = this.query.substring(0, whereIndex-1)
  }

  this.query += ' WHERE '
  let filters = []

  for(let field in conditions) {
    if(!this.schema[field])
      this.throwError(`Invalid column name: ${field}. It does not exists in the entity schema.`)

    let condition = conditions[field]
    filters.push( `${field} ${condition}` )
  }

  this.query += filters.join(' AND ')
  return this
}
/**
 * Builds a ORDER BY statement based on the columns provided.
 * 
 * @param {Object} columns Column names with boolean values to determine if the column is ordered ASC or DESC.
 * 
 * @returns self
 */
DBEntityHandler.prototype.orderBy = function(columns={}) {
  // Not conditions provided.
  if(!columns || Object.keys(columns).length === 0) return this
  // Invalid param.
  if(columns.constructor != Object)
    this.throwError(`Invalid param. Object is required but ${typeof(columns)} was provided.`)
  // Remove all after 'ORDER' if already exists in the query.
  let orderIndex = this.query.indexOf('ORDER')
  if(orderIndex != -1) {
    this.query = this.query.substring(0, orderIndex-1)
  }

  let conditions = []

  for(let col_name in columns) {
    let asc = columns[col_name] ? 'ASC' : 'DESC'
    conditions.push( `${col_name} ${asc}` )
  }

  this.query += ` ORDER BY ${conditions.join(', ')}`
  return this
}
/**
 * Builds a GROUP BY statement based on the columns provided.
 * 
 * @param {Object} columns Column names to group by.
 * 
 * @returns self
 */
DBEntityHandler.prototype.groupBy = function(...columns) {
  if(columns[0].constructor === Array) {
    columns = columns[0]
  }
  // Remove all after 'GROUP' if already exists in the query.
  let groupIndex = this.query.indexOf('GROUP')
  if(groupIndex != -1) {
    this.query = this.query.substring(0, groupIndex-1)
  }

  this.query += ` GROUP BY ${columns.join(', ')}`
  return this
}
/**
 * Adds a LIMIT clause.
 * 
 * @param {Number} n Number for the LIMIT Clause.
 * 
 * @returns self
 */
DBEntityHandler.prototype.limit = function(n) {
  if(n.constructor != Number || n <= 0) return this
  // Remove all after 'LIMIT' if already exists in the query.
  let limitIndex = this.query.indexOf('LIMIT')
  if(limitIndex != -1) {
    this.query = this.query.substring(0, limitIndex-1)
  }

  this.query += ` LIMIT ${n}`
  return this
}

DBEntityHandler.prototype.insert = function(values={}) {}


DBEntityHandler.prototype.execute = function(query=this.query) {
  return new Promise((resolve, reject) => {
    this.connection.connect(err => {
      if(err) reject(err)
  
      this.connection.query(this.query, (err, result) => {
        this.connection.end()
        if(err) reject(err)

        resolve(result)
      })
    })
  })
}

module.exports = DBEntityHandler
  