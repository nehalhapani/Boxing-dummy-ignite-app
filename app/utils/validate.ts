import { contains } from "ramda"
const ValidateJS = require("validate.js")

const Validate: any = ValidateJS.default ? ValidateJS.default : ValidateJS

/**
 * Validates that 1 attribute doesn't appear in another's attributes content.
 */
Validate.validators.excludes = function custom(value, options, key, attributes) {
  const list = attributes[options.attribute] || []
  if (value && contains(value, list)) {
    return options.message || `${value} is in the list`
  }
}

/**
 * Validates that another attribute isn't true.
 */
Validate.validators.tripped = function custom(value, options, key, attributes) {
  if (value && attributes[options.attribute] === true) {
    return options.message || `${options.attribute} is true`
  }
}

export interface ValidationRules {
  [key: string]: {}
}

export interface ValidationErrors {
  [key: string]: {}
}

/**
 * Runs the given rules against the data object.
 *
 * @param rules The rules to apply.
 * @param data The object to validate.
 */
export function validate(rules: ValidationRules, data: {}): ValidationErrors {
  if (typeof data !== "object") {
    return {} as ValidationErrors
  }
  return Validate(data, rules, { fullMessages: false }) || {}
}
