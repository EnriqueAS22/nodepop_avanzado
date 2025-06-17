import Product from "../models/Products.js";

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;
    res.locals.products = await Product.find({ owner: userId });

    const filterName = req.query.name;
    const filterPrice = req.query.price;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;

    const filter = {
      owner: userId,
    };

    if (filterName) {
      filter.name = filterName;
    }

    if (filterPrice) {
      filter.price = filterPrice;
    }

    res.locals.products = await Product.list(filter, limit, skip, sort);
  } catch (error) {
    next(error);
  }
}
