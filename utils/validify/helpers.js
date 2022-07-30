/**
 *
 * @param {Object} obj
 * @param {String} key
 * @param {any} value
 */
export const forcePush = (obj, key, value) => {
  if (obj.hasOwnProperty(key) && Array.isArray(obj[key])) {
    obj[key].push(value);
  } else {
    const temp = obj[key];
    obj[key] = [];
    if (temp) {
      obj[key].push(temp);
    }
    obj[key].push(value);
  }
};

/**
 *
 * @param {Object} obj
 * @param {String} key
 * @param {any} value
 * @returns {any}
 */
export const forceGet = (obj, key, value = null) => {
  return Object.keys(obj).includes(key) ? obj[key] : value;
};
