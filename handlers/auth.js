import Validator from "#root/utils/validify/validator.js";
import User from "#models/user.js";
import jsonwebtoken from "jsonwebtoken";
import redis from "#utils/connections/cache.js";
import { parseJwt } from "#root/utils/helpers.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const register = async (req, res) => {
  const validator = new Validator();
  validator.requiredFields = ["password", "name"];
  validator.stringFields = ["name", "password"];
  validator.maxLengthFields = {
    name: 45,
    password: 10,
  };
  validator.minLengthFields = {
    name: 2,
    password: 8,
  };
  validator.uniqueFields = {"name": "user|name"};

  const body = req.body || {};
  const errors = await validator.validate(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  /**
   * @type {import("mongoose").Model}
   */
  const user = await User.register(body.name, body.password);
  const tokens = await createTokens(user);

  return res.json(tokens);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const login = async (req, res) => {
  const validator = new Validator();
  validator.requiredFields = ["password", "name"];
  validator.stringFields = ["name", "password"];
  validator.existsFields = {"name": "user|name"};

  const body = req.body || {};
  const errors = await validator.validate(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const user = await User.findByName(body.name);
  const check = await user.checkPassword(body.password);
  if (!check) {
    return res
      .status(400)
      .json({ errors: { password: ["Password is incorrect"] } });
  }

  return res.json(await createTokens(user));
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
 export const refreshToken = async (req, res) => {
  const refreshToken = req.header("Refresh");
  let details = await redis.get(`refresh_tokens:${refreshToken}`);
  if (!details) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  const parsed = parseJwt(refreshToken);
  const token = parsed['access_token'] || null;
  details = JSON.parse(details);
  const user = await User.findById(details._id);
  const responses = await Promise.all([
    createTokens(user),
    redis.del(`refresh_tokens:${refreshToken}`),
    redis.del(`access_tokens:${token}`)
  ]);

  return res.json(responses[0]);
};

/**
 * @param {import("mongoose").Model} user
 * @returns {Promise<void>}
 */
const createTokens = async (user) => {
  const accessTokenExpiry = 3600;

  const accessToken = jsonwebtoken.sign(
    {
      iss: process.env.APP_NAME,
      sub: user._id,
      iat: new Date().getTime(),
    },
    process.env.JWT_SECRET
  );

  const refreshToken = jsonwebtoken.sign(
    {
      iss: process.env.APP_NAME,
      sub: user._id,
      iat: new Date().getTime(),
      access_token: accessToken,
    },
    process.env.JWT_SECRET
  );

  const promise1 = redis.setEx(
    `tokens:${accessToken}`,
    accessTokenExpiry,
    JSON.stringify(user.getLoginDetails())
  );
  const promise2 = redis.setEx(
    `refresh_tokens:${refreshToken}`,
    accessTokenExpiry * 4,
    JSON.stringify(user.getLoginDetails())
  );

  await Promise.all([promise1, promise2]);

  return { accessToken, refreshToken, expiresIn: accessTokenExpiry };
};
