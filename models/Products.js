import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    price: { type: Number, index: true },
    image: String,
    avatar: String,
    tags: [String],
  },
  {
    collection: "products",
  }
);

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
