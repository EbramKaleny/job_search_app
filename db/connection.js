import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log("connection to db success");
    })
};

export { dbConnection };
