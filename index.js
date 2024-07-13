import dotenv from 'dotenv';
dotenv.config()
import express from "express";
import { dbConnection } from "./db/connection.js";
import {appError} from './error/classError.js';
import UR from './routes/user.js';
import CR from './routes/company.js';
import JR from './routes/job.js';
import AR from './routes/applications.js';

dbConnection();
const app = express();
app.use(express.json());

app.use("/users", UR)
app.use("/companies", CR)
app.use("/jobs", JR)
app.use("/applications", AR)

app.all("*", (req, res, next) => {
  next(new appError("page not found", 404))
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({msg: "error", err: err.message})
})

app.listen(8000, () => {
  console.log("app listening on port 8000");
});