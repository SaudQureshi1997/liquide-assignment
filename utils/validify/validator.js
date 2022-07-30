import {
  required,
  isEmail,
  isString,
  minLength,
  maxLength,
  isBoolean,
  exists,
  unique,
  isRegex,
  isNumber,
  isDate,
  min,
  max,
} from "./rules.js";
import { forcePush, forceGet } from "./helpers.js";

export default class Validator {
  #callBacks = {};
  #errors = {};

  constructor() {
    this.requiredFields = [];
    this.emailFields = [];
    this.numberFields = [];
    this.minFields = {};
    this.stringFields = [];
    this.minLengthFields = {};
    this.maxLengthFields = {};
    this.regexFields = {};
    this.booleanFields = [];
    this.existsFields = {};
    this.uniqueFields = {};
    this.dateFields = {};
    this.#errors = {};
    this.#callBacks = this.#initializeValidationRules();
  }

  #initializeValidationRules() {
    return {
      requiredFields: {
        callback: required,
        message: (field, value) => `${field} is required`,
      },
      regexFields: {
        callback: isRegex,
        message: (field, value) => `${field} must match the pattern: ${value}`,
      },
      emailFields: {
        callback: isEmail,
        message: (field, value) => `${field} must be an email`,
      },
      numberFields: {
        callback: isNumber,
        message: (field, value) => `${field} must be numeric`,
      },
      stringFields: {
        callback: isString,
        message: (field, value) => `${field} must be a string`,
      },
      minLengthFields: {
        callback: minLength,
        message: (field, value) => `${field} must be of min length: ${value}`,
      },
      maxLengthFields: {
        callback: maxLength,
        message: (field, value) => `${field} must be of max length: ${value}`,
      },
      booleanFields: {
        callback: isBoolean,
        message: (field, value) => `${field} must be boolean: true or false. "${value}" given`,
      },
      existsFields: {
        callback: exists,
        message: (field, value) => `${field} does not exist`,
      },
      uniqueFields: {
        callback: unique,
        message: (field, value) => `${field} already exists`,
      },
      dateFields: {
        callback: isDate,
        message: (field, value) => `${field} must be a valid date`,
      },
      minFields: {
        callback: min,
        message: (field, value) => `${field} must be greater than or equal to ${value}`,
      },
      maxFields: {
        callback: max,
        message: (field, value) => `${field} must be less than or equal to ${value}`,
      }
    };
  }

  /**
   * @param {Object} body
   * @returns {Object}
   */
  async validate(body) {
    for (const fieldTypeName in this.#callBacks) {
      const fieldType = this[fieldTypeName];
      const callback = this.#callBacks[fieldTypeName].callback;
      const message = this.#callBacks[fieldTypeName].message;
      if (Array.isArray(fieldType)) {
        await this.#checkArray(body, fieldType, callback, message);
        continue;
      }
      await this.#checkObject(body, fieldType, callback, message);
    }

    return this.#errors;
  }

  /**
   * @param {Object} body
   * @param {Object} fields
   * @param {Function} callback
   * @param {String} message
   */
  async #checkArray(body, fields, callback, message) {
    for (const field of fields) {
      const value = forceGet(body, field, null);
      const retVal = await callback(value);
      if (!retVal) {
        forcePush(this.#errors, field, message(field, value));
      }
    }
  }

  /**
   * @param {Object} body
   * @param {Object} fields
   * @param {Function} callback
   * @param {String} message
   */
  async #checkObject(body, fields, callback, message) {
    for (const field in fields) {
      const value = forceGet(body, field, null);
      const retVal = await callback(value, fields[field]);
      if (!retVal) {
        forcePush(this.#errors, field, message(field, fields[field]));
      }
    }
  }
}
