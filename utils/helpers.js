import redis from "#utils/connections/cache.js";

/**
 *
 * @param {import("express").Request} req
 * @returns {Promise<import("#utils/types.js").Auth>}
 */
export const auth = async (req) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const details = await redis.get(`tokens:${token}`);

  return JSON.parse(details || null);
};

export const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

/**
 * @param {Object} obj
 * @param {Array} keys
 *
 * @returns {Object}
 */
export const only = (obj, keys) => {
  const _obj = {};
  for (let k in obj) {
    if (keys.includes(k)) {
      _obj[k] = obj[k];
    }
  }

  return _obj;
};

/**
 * 
 * @param {Object} data 
 * @param {Object} filters
 * 
 * @returns {Object}
 */
export const createFilterQuery = (data, filters) => {
  data = only(data || {}, Object.keys(filters));
  const query = {};

  for (const key in data) {
    const callback = filters[key];
    callback(data[key], query);
  }

  return query;
}