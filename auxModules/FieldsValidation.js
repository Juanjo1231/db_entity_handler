/**
 * Validates that the fields provided matches the certain schema.
 * 
 * @param {Object}   fields_schema     JSON defining the fields schema to apply.
 * @param {Object}   fields_to_compare Fields provided to compare to the schema.
 * @param {Function} err_handler       Function to call if any error occurs.
 * 
 * @returns {Object} fields_to_compare object including fields with default values.
 */
module.exports = function(fields_schema, fields_to_compare, err_handler) {
  try {
    for(let field in fields_schema) {
      let userField   = fields_to_compare[field]
      let fieldSchema = fields_schema[field]
      // Field not provided.
      if(userField === undefined || userField === null) {
        // Field has default value.
        if(fieldSchema.default != undefined) {
          fields_to_compare[field] = fieldSchema.default
        }
        // Field is required and has no default value.
        else if(fieldSchema.required) {
          let type = fieldSchema.type.name
          let error = new Error(`${field} of type ${type} is required.`)
          err_handler(error)
        }
      }
      // Field provided with multiple settings.
      else if(fieldSchema.constructor === Object) {
        // Field doesn't match the type specified in the schema.
        if(userField.constructor != fieldSchema.type) {
          let type = fieldSchema.type.name
          let error = new Error(`${field} must be an instance of ${type} but ${typeof(userField)} was provided.`)
          err_handler(error)
        }
      }
      // Optional Field with type only.
      else if(fieldSchema.constructor === Function) {
        // Field doesn't match the type specified in the schema.
        if(userField.constructor != fieldSchema) {
          let type = fieldSchema.name
          let error = new Error(`${field} must be an instance of ${type} but ${typeof(userField)} was provided.`)
          err_handler(error)
        }
      }
    }
  } catch (error) {
    err_handler(error)
  }

  return fields_to_compare
}
