import path from "node:path";
import express from "express";
import createError from "http-errors";
import logger from "morgan";
import connectMongoose from "./lib/connectMongoose.js";
import * as homeController from "./controllers/homeController.js";
import * as loginController from "./controllers/loginController.js";
import * as sessionManager from "./lib/sessionManager.js";
import * as productsController from "./controllers/productsController.js";
import * as apiProductsController from "./controllers/api/apiProductsController.js";
import upload from "./lib/uploadConfig.js";
import i18n from "./lib/i18nConfig.js";
import * as localeController from "./controllers/localeController.js";
import cookieParser from "cookie-parser";

/**
 * MONGODB CONEXION
 */
await connectMongoose();
console.log("Connected to MongoDB");

/**
 * APP INIT
 */
const app = express();

app.set("views", "views");
app.set("view engine", "ejs");
app.locals.appName = "NodePop";

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.json());

/**
 * API ROUTES
 */
app.get("/api/products", apiProductsController.list);
app.get("/api/products/:productId", apiProductsController.getOne);
app.post(
  "/api/products",
  upload.single("avatar"),
  apiProductsController.newProduct
);
app.put(
  "/api/products/:productId",
  upload.single("avatar"),
  apiProductsController.update
);
app.delete("/api/products/:productId", apiProductsController.deleteProduct);

/**
 * WEB APLICATION ROUTES
 */
app.use(cookieParser());
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.use(i18n.init);
app.get("/change-locale/:locale", localeController.changeLocale);
app.get("/", homeController.index);
app.get("/login", loginController.index);
app.post("/login", loginController.postLogin);
app.get("/logout", loginController.logout);
app.get("/products/new", sessionManager.guard, productsController.index);
app.post(
  "/products/new",
  sessionManager.guard,
  upload.single("avatar"),
  productsController.postNew
);
app.get(
  "/products/delete/:productId",
  sessionManager.guard,
  productsController.deleteProduct
);

app.use((req, res, next) => {
  next(createError(404));
});

/**
 * ERROR
 */
app.use((err, req, res, next) => {
  if (err.array) {
    err.message =
      "Invalid request:  " +
      err
        .array()
        .map((e) => `${e.location} ${e.type} ${e.path} ${e.msg}`)
        .join(", ");

    err.status = 422;
  }

  res.status(err.status || 500);

  /**
   * JSON ERROR
   */
  if (req.url.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  res.locals.message = err.message;
  res.locals.error = process.env.NODEAPP_ENV === "development" ? err : {};

  res.render("error");
});

/**
 * EXPORT
 */
export default app;
