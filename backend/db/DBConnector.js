const mysql = require('mysql')

class DBConnector {
  constructor(config={}) {
    let required = ['host', 'port', 'database', 'user', 'password']
    for(let key in config) {
      if(!required.includes(key)) {
        throw new Error(`Missing ${key} for Database connection.`)
      }
    }

    this.connection = mysql.createConnection(config)
  }
}

DBConnector.prototype.execute = function(query) {
  return new Promise((resolve, reject) => {
    this.connection.connect(err => {
      if(err) reject(err)
    })

    this.connection.query(query, (err, result) => {
      if(err) reject(err)
      
      this.connection.end()
      resolve(result)
    })
  })
}

module.exports = DBConnector
