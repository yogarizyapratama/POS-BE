"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Buat format kustom dengan warna
const customFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), // Aktifkan warna
winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Tambahkan timestamp
winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${JSON.stringify(message)}`;
}));
// Inisialisasi logger
exports.logger = winston_1.default.createLogger({
    level: 'debug',
    format: customFormat, // Gunakan format kustom
    transports: [
        new winston_1.default.transports.Console()
    ]
});
