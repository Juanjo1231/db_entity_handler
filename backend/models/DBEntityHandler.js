const mysql = require('mysql')
const chalk = require('chalk')
const DBEntityHandlerErrors = {
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_PARAM_TYPE: 'INVALID_PARAM_TYPE',
  INVALID_COL_NAME: 'INVALID_COL_NAME',
  NO_INSERT_VALUES: 'NO_INSERT_VALUES',
  REQ_FIELD_MISSING: 'REQ_FIELD_MISSING',
  TYPE_MISMATCH: 'TYPE_MISMATCH'
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
 * Creates a SELECT query based on the columns provided with optional SQL function to
 * apply to the columns, all columns are retreived if no columns are provided.
 * 
 * @param {String} columns      List of columns to retreive with optional SQL function.
 * @param {String} columns[n].f Name of a SQL function to apply to the column.
 * 
 * @returns self
 */
DBEntityHandler.prototype.select = function(...columns) {
  // JSON or Array provided as the only param.
  if(columns[0].constructor === Array || columns[0].constructor === Object) {columns = columns[0]}
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
    if(!this.schema[field]) {
      let error = new Error(`Invalid column name: ${field}. It does not exists in the entity schema.`)
      error.name = DBEntityHandlerErrors.INVALID_COL_NAME
      throw error
    }

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
  if(columns.constructor != Object) {
    let error = new Error(`Object is required but ${typeof(columns)} was provided.`)
    error.name = DBEntityHandlerErrors.INVALID_PARAM_TYPE
    throw error
  }
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
/**
 * Inserts the values in DB.
 * 
 * @param {String} table_name Name of the table to inser the data to.
 * @param {Object} values     {col_name: col_value}.
 * 
 * @returns {Promise} Query result on resolved.
 */
DBEntityHandler.prototype.insert = function(table_name, values) {
  if(!values || values.constructor != Object) {
    let error = new Error('No values provided to insert in DB.')
    error.name = DBEntityHandlerErrors.NO_INSERT_VALUES
    throw error
  }

  for(let field in this.schema) {
    let field_user   = values[field]
    let field_schema = this.schema[field]
    // Field not provided by user.
    if(!field_user) {
      // Default value in schema.
      if(field_schema.default != undefined) {
        values[field] = field_schema.default
      }
      // No default value in schema.
      // Field is required.
      else if(field_schema.required != undefined) {
        let type  = field.type
        let error = new Error(`A value for column ${field} of type ${type} is required but was not provided.`)
        error.name = DBEntityHandlerErrors.REQ_FIELD_MISSING
        throw error
      }
    }
    // Field provided
    else {
      let expected_type = this.schema[field].type
      // Type doesn't match schema.
      if(field_user.constructor != expected_type) {
        let error = new Error(`${expected_type.name} was expected for column ${field} but ${typeof(field_user)} was provided.`)
        error.name = DBEntityHandlerErrors.TYPE_MISMATCH
        throw error
      }
    }
  }

  this.buildInsertQuery(table_name, values)
  return this.execute()
}
/**
 * Builds the INSERT INTO query.
 * 
 * @param {String} table_name Name of the table to inser the data to.
 * 
 * @param {Object} values {col_name: col_value}.
 */
DBEntityHandler.prototype.buildInsertQuery = function(table_name, values) {
  let qColumns = []
  let qValues  = []
  let qValPlaceholders = []

  for(let col_name in values) {
    qColumns.push(col_name)
    qValues.push(values[col_name])
    qValPlaceholders.push('?')
  }

  this.query = `INSERT INTO ${table_name}(${qColumns.join(', ')}) VALUES(${qValPlaceholders.join(', ')})`
  this.query = mysql.format(this.query, qValues)
}
/**
 * Connect to DB and execute the query.
 * 
 * @param {String} [query=this.query] Query to execute.
 * 
 * @returns {Promise} Query result on resolved.
 */
DBEntityHandler.prototype.execute = function(query=this.query) {
  return new Promise((resolve, reject) => {
    this.connection.connect(err => {
      if(err) {
        this.query = ''
        reject(err)
      }
  
      this.connection.query(query, (err, result) => {
        this.connection.end()
        this.query = ''

        if(err)
          reject(err)

        resolve(result)
      })
    })
  })
}

module.exports = DBEntityHandler
  