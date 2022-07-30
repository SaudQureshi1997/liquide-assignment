import mongoose from "mongoose";

/**
 *
 * @returns {Promise<typeof mongoose>}
 */
export const initialize = () => {
  return mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`,
    {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
    }
  );
};
