"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimiter = ratelimiter;
const rate_limit_1 = require("./rate-limit");
function ratelimiter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const isLimited = yield (0, rate_limit_1.isRateLimit)(ip, 5, 60);
        if (isLimited) {
            return res.status(429).json({ message: "Rate limit exceeded" });
        }
        next(); // pass to next middleware
    });
}
