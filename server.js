import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
dotenv.config();

app.use("/api", userRoutes);
app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("heeloo world");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running ${process.env.PORT}`);
  connectDatabase();
});
