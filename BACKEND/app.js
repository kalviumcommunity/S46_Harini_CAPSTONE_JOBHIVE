import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import useRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { dbconnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
dotenv.config({ path: "./config/.env" });

// ✅ FIXED CORS CONFIGURATION
app.use(
  cors({
    origin: "*", // ✅ Allow frontend domain
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // ✅ Allow cookies/auth headers
  })
);

// ✅ REMOVE DUPLICATE CORS CALL

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", useRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/job", jobRouter);

dbconnection();
app.use(errorMiddleware);

export default app;
