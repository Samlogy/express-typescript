require("dotenv").config({ path: './config.dev.env' });
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { Request, Response, NextFunction } from "express";
const xssCleaner = require('xss-clean');
const cors = require('cors');

import config from "config";
import log from "./logger";
import connect from "./utils/connectDB";
import userRoutes from "./routes/user.routes";
import cache from "./utils/cacheDB";

// import { deserializeUser } from "./middleware";

const port = config.get("port") as number;
const host = config.get("host") as string;

import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./controllers/error.controller";

const app = express();
// app.use(deserializeUser);

// request body as JSON + set a limit of 10Kb in the body request
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

const allowList = ['http://localhost:3000']

const corsManip = (req: Request, callback: any) => {
    let corsOptions;
    const origin = req.header('Origin') as string;

    if (allowList.indexOf(origin) !== -1) {
        corsOptions = { origin: true } // enable requested origin in cors response
    } else {
      corsOptions = { origin: false } // disable cors in reponse 
    }
    callback(null, corsOptions)
};

app.use(cors(corsManip))

// helmet
app.use(helmet()); // recommended to be done early

// rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // Limit each IP to 100 create account requests per `window` (here, per hour)
	message: 'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); //  apply to all requests

// data sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());

// data sanitization against XSS to prevent HTML code inside DB
app.use(xssCleaner())

if (process.env.NODE_ENV === "prod") {
  app.all("*", (req, res, next) => {
    if (req.secure) return next();
    else if (req.hostname == "backend")  next();
    return res.redirect(307, `https://${req.hostname}:${app.get("secPort")}${req.url}`);
  });
};

// handle inexistant routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
	// if we pass something to next() express will assume it is an error object and call Global error handling middlware immedialtly
	next(AppError(res, `the url ${req.originalUrl} is not found`, 404, false))
})

// Global Error handling middleware
app.use(globalErrorHandler)

app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);

  // connect to DB
  connect();

  // cache DB
  // cache();

  // Routes
  userRoutes(app);
});