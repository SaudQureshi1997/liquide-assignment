import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const makeup = {
  name: {
    type: String,
    required: true,
    maxLength: 150,
  },
  password: {
    type: String,
  },
};

const options = {
  timestamps: true,
  methods: {
    getLoginDetails: function () {
      return {
        _id: this._id,
        name: this.name,
      };
    },
    checkPassword: function (password) {
      return bcrypt.compareSync(password, this.password);
    },
  },
  statics: {
    register(name, password) {
      return this.create({
        name,
        password: bcrypt.hashSync(password, 10),
      });
    },
    findByName(name) {
      return this.findOne({ name });
    },
    findById(id) {
      return this.findOne({ _id: mongoose.Types.ObjectId(id) });
    },
  },
};

const schema = new mongoose.Schema(makeup, options);

schema.index({ name: 1 }, { unique: true });

/**
 * @type {import("#utils/types.js").UserModel}
 */
const model = mongoose.model("user", schema);

export default model;
