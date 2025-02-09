import winston from 'winston';

// Buat format kustom dengan warna
const customFormat = winston.format.combine(
    winston.format.colorize({all:true}), // Aktifkan warna
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Tambahkan timestamp
    winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${typeof message === 'object' ? JSON.stringify(message, null, 2) : message}`;
    })
);

// Inisialisasi logger
export const logger = winston.createLogger({
    level: 'debug',
    format: customFormat, // Gunakan format kustom
    transports: [
        new winston.transports.Console()
    ]
});