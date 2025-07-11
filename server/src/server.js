import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import middlewares from "./middlewares/index.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();
const port = process.env.APP_PORT;
const allowedOrigins = [process.env.CLI_PORT, process.env.ADM_PORT];

app.use(express.json());
app.use(middlewares.logger);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(router);

app.listen(port, () => {
  console.log(`Server up and running @${port}.`);
});
