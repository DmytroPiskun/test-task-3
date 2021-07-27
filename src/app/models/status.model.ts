import { Schema, model } from "mongoose";

const statusSchema = new Schema({
  status: { type: String },
});

const statusModel = model("userstatuses", statusSchema);

export default statusModel;
