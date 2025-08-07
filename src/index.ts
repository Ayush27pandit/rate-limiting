import express, { Request, Response } from "express";
import { ratelimiter } from "./ratelimiter"; // assumes you’ve implemented this
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(ratelimiter); // rate limiting middleware

app.get("/getdata", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Data fetched" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
