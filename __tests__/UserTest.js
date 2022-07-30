import axios from "axios";
import User from "#models/user.js";
import { initialize } from "#root/utils/connections/database.js";
import dotenv from "dotenv";

describe("User acceptance test", () => {
  beforeAll(() => dotenv.config());

  const register = (user) => {
    return axios.post(`${process.env.APP_URL}/auth/register`, user);
  };

  const checkTokenResponse = (data) => {
    expect(data).toBeInstanceOf(Object);
    expect(data.hasOwnProperty("accessToken")).toBeTruthy();
    expect(data.hasOwnProperty("refreshToken")).toBeTruthy();
    expect(data.hasOwnProperty("expiresIn")).toBeTruthy();
  };

  it("should fail registration for invalid password", async () => {
    const user = {
      name: "Saud Qureshi",
      password: "123456",
    };
    try {
      await await register(user);
    } catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.data.password).toBeDefined();
      expect(e.response.data.password).toBeInstanceOf(Array);
    }
  });

  it("should register user", async () => {
    const user = {
      name: "Saud Qureshi",
      password: "12345678",
    };
    try {
      const response = await register(user);
      expect(response.status).toBe(200);
      checkTokenResponse(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      await initialize();
      await User.deleteMany({ name: user.name });
    }
  });

  it("should login", async () => {
    const user = {
      name: "Saud Qureshi",
      password: "12345678",
    };
    try {
      await register(user);
      const response = await axios.post(
        `${process.env.APP_URL}/auth/login`,
        user
      );
      expect(response.status).toBe(200);
      checkTokenResponse(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      await initialize();
      await User.deleteMany({ name: user.name });
    }
  });

  it("should refresh token", async () => {
    const user = {
      name: "Saud Qureshi",
      password: "12345678",
    };
    try {
      let response = await register(user);
      response = await axios.post(
        `${process.env.APP_URL}/auth/refresh`,
        {},
        {
          headers: {
            Refresh: response.data.refreshToken,
          },
        }
      );
      expect(response.status).toBe(200);
      checkTokenResponse(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      await initialize();
      await User.deleteMany({ name: user.name });
    }
  });
});
