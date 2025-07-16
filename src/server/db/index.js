"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var postgres_js_1 = require("drizzle-orm/postgres-js");
var postgres_1 = require("postgres");
var env_1 = require("~/env");
var schema = require("./schema");
var globalForDb = globalThis;
var conn = (_a = globalForDb.conn) !== null && _a !== void 0 ? _a : (0, postgres_1.default)(env_1.env.DATABASE_URL);
if (env_1.env.NODE_ENV !== 'production')
    globalForDb.conn = conn;
exports.db = (0, postgres_js_1.drizzle)(conn, { schema: schema });
