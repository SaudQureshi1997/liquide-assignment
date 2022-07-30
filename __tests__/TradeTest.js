import axios from "axios";
import User from "#models/user.js";
import Trade from "#models/trade.js";
import { initialize } from "#root/utils/connections/database.js";
import dotenv from "dotenv";

describe("Trade acceptance test", () => {
  let tokens = null;
  const register = (user) => {
    return axios.post(`${process.env.APP_URL}/auth/register`, user);
  };
  beforeAll(async () => {
    dotenv.config();
    const response = await register({
      name: "Saud Qureshi",
      password: "12345678",
    });
    tokens = response.data;
  });
  afterAll(async () => {
    await initialize();
    const user = await User.findOne({ name: "Saud Qureshi" });
    Trade.deleteMany({ user_id: user._id });
    await User.deleteMany({ name: "Saud Qureshi" });
  });
  it("should not create trades for shares greater than 100", async () => {
    const data = {
      type: "BUY",
      symbol: "AAPL",
      shares: 101,
      price: 100,
      datetime: "2022-06-30T00:00:00.000Z",
    };
    try {
      const response = await axios.post(`${process.env.APP_URL}/trades`, data, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    } catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.data.shares).toBeDefined();
      expect(e.response.data.shares).toBeInstanceOf(Array);
    }
  });
});
