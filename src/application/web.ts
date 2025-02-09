import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// @ts-ignore
import xssClean from 'xss-clean';

import { publicRouter } from '../router/public-api';
import { errorMiddleware } from '../middleware/error-middleware';
import { apiRouter } from '../router/api';

export const web = express();

// Security Middlewares
web.use(helmet());
web.use(cors({
  origin: "*", // Izinkan semua origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Izinkan semua metode
  allowedHeaders: ["Content-Type", "X-API-TOKEN"], // Header yang diizinkan
  credentials: true
}));
web.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimum 100 request per IP dalam 15 menit
  message: "Too many requests, please try again later."
}));
web.use(compression());
web.use(cookieParser());
web.use(xssClean());

web.use(express.json());

web.use(publicRouter);
web.use(apiRouter);

web.use(errorMiddleware);
