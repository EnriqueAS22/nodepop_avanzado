import Product from "../../models/Products.js";

export async function list(req, res, next) {
  try {
    const products = await Product.find();
    res.json({ results: products });
  } catch (error) {
    next(error);
  }
}
