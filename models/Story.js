const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  // displayName: {
  //   type: String,
  //   required: true,
  // },

  status: {
    type: String,
    default: "private",
    enum: ["public", "private"],
  },

  body: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Story", storySchema);
