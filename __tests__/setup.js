import "regenerator-runtime/runtime";
import { initialize } from "#utils/connections/database.js";
import dotenv from "dotenv";

beforeAll(async () => {
    dotenv.config();
    await initialize();
});