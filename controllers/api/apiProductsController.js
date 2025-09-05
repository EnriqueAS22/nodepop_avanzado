import Product from "../../models/Products.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";
import thumbnailRequester from "../../lib/thumbnailRequester.js";

export async function list(req, res, next) {
  try {
    const userId = req.apiUserId;
    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const fields = req.query.fields;
    const withCount = req.query.count === "true";

    const filter = {
      owner: userId,
    };

    if (filterName) {
      filter.name = filterName;
    }

    if (filterPrice) {
      filter.price = filterPrice;
    }

    const products = await Product.list(filter, limit, skip, sort, fields);

    const result = { results: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;
    const product = await Product.findOne({ _id: productId, owner: userId });

    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;
    const userId = req.apiUserId;
    const product = new Product(productData);
    product.avatar = req.file?.filename;
    product.owner = userId;
    const savedProduct = await product.save();

    // Emitimos evento al Thumbnail
    if (req.file) {
      thumbnailRequester.send({
        type: "create-thumbnail",
        imagePath: `public/avatars/${req.file.filename}`,
        filename: req.file.filename,
      });
    }

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;
    const productData = req.body;
    productData.avatar = req.file?.filename;
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        owner: userId,
      },
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
    const userId = req.apiUserId;

    // validar que el producto que queremos borrar pertenece al usuario
    const product = await Product.findById(productId);

    // comprobar que existe
    if (!product) {
      console.log(
        `WARINING!!! user ${userId} is trying to delete non existing agent`
      );
      next(createError(404));
      return;
    }

    //comprobar la propiedad
    if (product.owner.toString() !== userId) {
      console.log(
        `WARINING!!! user ${userId} is trying to delete products of other users`
      );
      next(createError(401));
      return;
    }

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
