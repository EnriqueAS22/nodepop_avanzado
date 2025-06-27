import "dotenv/config";

import readline from "node:readline/promises";
import connectMongoose from "./lib/connectMongoose.js";
import Product from "./models/Products.js";
import User from "./models/Users.js";

/**
 * CONECTION WITH MONGODB
 */
const connection = await connectMongoose();
console.log("Connected to MongoDB:", connection.name);

/**
 * initDB QUESTION
 */
const answer = await ask(
  "Are you sure you want to delete database collection? (n)"
);
if (answer !== "y") {
  console.log("Operation aborted");
  process.exit();
}

/**
 * INIT
 */
await initUsers();
await initProducts();
await connection.close();

/**
 * USERS
 */
async function initUsers() {
  const result = await User.deleteMany();
  console.log(`Deleted ${result.deletedCount} users.`);

  const insertResult = await User.insertMany([
    { email: "paco@usuario.com", password: await User.hashPassword("1234") },
    { email: "kike@usuario.com", password: await User.hashPassword("1234") },
  ]);

  console.log(`Insert ${insertResult.length} users.`);
}

/**
 * PRODUCTS
 */
async function initProducts() {
  const result = await Product.deleteMany();
  console.log(`${result.deletedCount} products deleted`);

  const [paco, kike] = await Promise.all([
    User.findOne({ email: "paco@usuario.com" }),
    User.findOne({ email: "kike@usuario.com" }),
  ]);

  const insertResult = await Product.insertMany([]);
  console.log(`Insert ${insertResult.length} products.`);
}

/**
 * initDB
 */
async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const result = await rl.question(question);
  rl.close();
  return result;
}
