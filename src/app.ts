require("dotenv").config();
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import config from "config";
import log from "./logger";
import connect from "./utils/connectDB";
import userRoutes from "./routes/user.routes";
// import { deserializeUser } from "./middleware";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();
// app.use(deserializeUser);

// request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

if (process.env.NODE_ENV === "prod") {
  app.all("*", (req, res, next) => {
    if (req.secure) {
      return next();
    } else if (req.hostname == "backend") {
      return next();
    }
    return res.redirect(307, `https://${req.hostname}:${app.get("secPort")}${req.url}`);
  });
};


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(); // 404 error
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);

  // connect to DB
  connect();

  // Routes
  userRoutes(app);
});