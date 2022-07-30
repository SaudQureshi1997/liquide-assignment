import express from "express";
import { initialize as initDB } from "#utils/connections/database.js";
import apiRoutes from "./routes.js";
import cors from "cors";
import mongoose from "mongoose";

/**
 * 
 * @param {express.Express} app 
 */
const initialize = async (app) => {
  await initDB();
  app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on: ${process.env.APP_PORT}`);
  });
};

/**
 * 
 * @param {express.Express} app 
 */
const plugInRoutes = (app, routes) => {
  app.use(cors());
  app.use(express.json());
  app.use((err, req, res, next) => {
    if (err.code) {
      return res.status(err.code).json({ error: err.message });
    }
    return res.json({message: 'Something went wrong'}, 500);
  });
  routes.forEach((route) => {
    route.methods.forEach((method) => {
      method = method.toLowerCase();
      app[method](route.path, route.middlewares || [], async (req, res, next) => {
        try {
          await route.handler(req, res);
        } catch (err) {
          return next(err);
        }
      });
    });
  });
}

const app = express();

plugInRoutes(app, apiRoutes);
initialize(app);
