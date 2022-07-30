import redis from "#utils/connections/cache.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} res
 */
export default async (req, res, next) => {
  if (req.header("Authorization")) {
    return res.json({ message: "Cannot access" }, 403);
  }

  return next();
};
