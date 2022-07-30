import { auth } from "#utils/helpers.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} res
 */
export default async (req, res, next) => {
    let token = req.header("Authorization") || "";
    token = token.replace("Bearer ", "");
    const details = await auth(req);

  if (!token || !details) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};
