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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRateLimit = isRateLimit;
const redis_1 = require("@upstash/redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis = new redis_1.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
function isRateLimit(ip_1) {
    return __awaiter(this, arguments, void 0, function* (ip, limit = 10, windowInSeconds = 10) {
        const key = "rate-limit:" + ip;
        const now = Math.floor(Date.now() / 1000);
        const results = yield redis
            .pipeline()
            .zremrangebyscore(key, 0, now - windowInSeconds) //remove old tokens
            .zadd(key, { score: now, member: `${now}=${Math.random()}` }) //add new token
            .zcard(key) //get count
            .expire(key, windowInSeconds)
            .exec();
        const count = results[2]; // zcard is the third command in the pipeline
        return count > limit;
    });
}
