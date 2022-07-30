import mongoose from "mongoose";

const makeup = {
  type: {
    required: true,
    type: String,
    enum: ["BUY", "SELL"],
    index: true,
  },
  symbol: {
    required: true,
    type: String,
    index: true,
  },
  shares: {
    required: true,
    type: Number,
    min: 1,
  },
  user_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },
  price: {
    required: true,
    type: Number,
  },
  timestamp: {
    required: true,
    type: Number,
    index: true,
  },
};

const options = {};
const schema = new mongoose.Schema(makeup, options);
const model = mongoose.model("trade", schema);

const filters = {
  type: (value, query) => (query["type"] = value),
  symbol: (value, query) => (query["symbol"] = value),
  user_id: (value, query) =>
    (query["user_id"] = mongoose.Types.ObjectId(value)),
};

export default model;
export { filters };
