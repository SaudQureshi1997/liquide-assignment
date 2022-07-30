import Trade, { filters as tradeFilters } from "#models/trade.js";
import Validator from "#root/utils/validify/validator.js";
import { auth, createFilterQuery } from "#utils/helpers.js";
import { DateTime } from "luxon";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const index = async (req, res) => {
  const user = await auth(req);
  const query = Object.assign({ user_id: user._id }, req.query);
  const filters = createFilterQuery(query, tradeFilters);

  const trades = await Trade.find(filters, {user_id: 0, shares: 0, price: 0});

  return res.json(trades);
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const show = async (req, res) => {
  const trade = await Trade.findById(req.params.id);

  return res.json(trade);
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const store = async (req, res) => {
  const validator = new Validator();
  validator.requiredFields = ["type", "symbol", "shares", "price", "datetime"];
  validator.stringFields = ["type", "symbol"];
  validator.numberFields = ["shares", "price"];
  validator.minFields = { shares: 1 };
  validator.maxFields = { shares: 100 };
  validator.dateFields = ["datetime"];

  const errors = await validator.validate(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const user = await auth(req);

  const body = {
    type: req.body.type,
    symbol: req.body.symbol,
    shares: req.body.shares,
    price: req.body.price,
    timestamp: DateTime.fromISO(req.body.datetime).toMillis(),
    user_id: user._id,
  };

  const trade = await Trade.create(body);

  return res.json(trade);
};
