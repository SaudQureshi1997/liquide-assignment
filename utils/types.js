/**
 * @typedef {Object} UserModel
 * @property {Function} register
 */

/**
 * @typedef {Object} User
 * @property {String} name
 * @property {String} password
 */

/**
 * @typedef {Object} AuthUser
 * @property {import("mongoose").Types.ObjectId} _id
 * @property {String} name
 * @property {String} password
 */

/**
 * @typedef {Object} Auth
 * @property {AuthUser} user
 */

export {
    UserModel,
    User,
    AuthUser,
    Auth,
};