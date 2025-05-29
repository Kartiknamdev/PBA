// /api/index.js
import { app } from "../src/app.js";
import { connectDB } from "../src/db/database.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}
