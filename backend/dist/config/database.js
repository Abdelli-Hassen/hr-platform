"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "human_ressources",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const query = (sql, values) => {
    return exports.pool.execute(sql, values);
};
exports.query = query;
//# sourceMappingURL=database.js.map