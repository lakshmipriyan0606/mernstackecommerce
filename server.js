import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";
import router from "./routes/user.js";

const app = express();
app.use(express.json())
dotenv.config();

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("heeloo world");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running ${process.env.PORT}`);
  connectDatabase();
});
