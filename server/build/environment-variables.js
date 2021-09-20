"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.ALLOW_ORIGINS = void 0;
exports.ALLOW_ORIGINS = process.env.ALLOW_ORIGINS || '*';
exports.PORT = parseInt(process.env.PORT, 10) || 9000;
