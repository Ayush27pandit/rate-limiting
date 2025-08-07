"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratelimiter_1 = require("./ratelimiter"); // assumes you’ve implemented this
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(ratelimiter_1.ratelimiter); // rate limiting middleware
app.get("/getdata", (req, res) => {
    return res.status(200).json({ message: "Data fetched" });
});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
