import mongoose from "mongoose";
import { DateTime } from "luxon";

/**
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const required = (value) => {
  return value !== null && value !== "" && value !== undefined;
};

/**
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const isBoolean = (value) => {
  return typeof value === "boolean";
};

/**
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const isNumber = (value) => {
  return isNaN(value) === false;
};

export const isDate = (value) => {
  return DateTime.fromISO(value).isValid;
};

/**
 * 
 * @param {Number} value 
 * @param {Number} cap 
 * @returns {Boolean}
 */
export const min = (value, cap) => value >= cap;

/**
 * 
 * @param {Number} value 
 * @param {Number} cap 
 * @returns {Boolean}
 */
 export const max = (value, cap) => value <= cap;

/**
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const isString = (value) => {
  return typeof value === "string";
};

/**
 *
 * @param {String|Array} value
 * @param {Number} length
 * @returns {Boolean}
 */
export const minLength = (value, length) => {
  return value.length >= length;
};

/**
 *
 * @param {String|Array} value
 * @param {Number} length
 * @returns {Boolean}
 */
export const maxLength = (value, length) => {
  return value.length <= length;
};

/**
 *
 * @param {string} value
 * @param {string} expected
 * @returns {Boolean}
 */
export const mustBe = (value, expected) => {
  return value == expected;
};

/**
 *
 * @param {Object} value
 * @returns {Boolean}
 */
export const isEmail = (value) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return regex.test(value);
};

/**
 *
 * @param {string} value
 * @param {RegExp} expected
 * @returns {Boolean}
 */
export const isRegex = (value, regex) => {
  return regex.test(value);
};

/**
 *
 * @param {String|Number|Boolean} value
 * @param {String} params
 * @returns {Promise<Boolean>}
 */
export const exists = async (value, params) => {
  params = params.split("|");
  const modelName = params[0];
  const columnName = params[1];
  const data = await mongoose.model(modelName).findOne({ [columnName]: value });

  return data !== null;
};

/**
 *
 * @param {String|Number|Boolean} value
 * @param {String} params
 * @returns {Promise<Boolean>}
 */
export const unique = async (value, params) => {
  const val = await exists(value, params);

  return !val;
};
