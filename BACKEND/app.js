import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import  useRouter from "./routes/userRouter.js";
import  applicationRouter from "./routes/applicationRouter.js";
import  jobRouter from "./routes/jobRouter.js";







const app = express();
dotenv.config({path:'./config/config.env'});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true,
})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp",

})
);
app.use("/api/v1/user",useRouter);
app.use("/api/v1/application",applicationRouter);
app.use("/api/v1/job",jobRouter);



export default app;
