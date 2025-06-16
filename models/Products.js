import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    price: Number,
    image: String,
    avatar: String,
    tags: [String],
  },
  {
    collection: "products",
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
