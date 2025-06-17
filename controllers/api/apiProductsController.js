import Product from "../../models/Products.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

export async function list(req, res, next) {
  try {
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const fields = req.query.fields;

    const filter = {
      // TODO Implement API authentication
      // owner: userId,
    };

    if (filterName) {
      filter.name = filterName;
    }

    if (filterPrice) {
      filter.price = filterPrice;
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    res.json({ results: products });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;
    const product = new Product(productData);
    product.avatar = req.file?.filename;
    const savedProduct = await product.save();

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const productId = req.params.productId;
    const productData = req.body;
    productData.avatar = req.file?.filename;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
      }
    );

    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (product.avatar) {
      await unlink(
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "public",
          "avatars",
          product.avatar
        )
      );
    }
    await Product.deleteOne({ _id: productId });
    res.json();
  } catch (error) {
    next(error);
  }
}
