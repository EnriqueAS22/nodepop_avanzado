import Product from "../models/Products.js";

export function index(req, res, next) {
  res.render("new-product");
}

/**
 * NEW PRODUCT
 */
export async function postNew(req, res, next) {
  try {
    const { name, price, tags } = req.body;
    const userId = req.session.userId;
    const product = new Product({
      name,
      owner: userId,
      price,
      avatar: req.file ? req.file.filename : null,
      tags,
    });
    await product.save();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(req, res, next) {
  try {
    const userId = req.session.userId;
    const productId = req.params.productId;
    await Product.deleteOne({ _id: productId, owner: userId });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
