import userModel from "../db/models/user.js";
import jwt from "jsonwebtoken";
import { appError } from "../error/classError.js";
import { systemRoles } from "../services/systemRoles.js";

export const auth = (roles = Object.values(systemRoles)) => {
  return async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
          next(new appError("invalid token", 400));
        }
        if (!token.startsWith("ebram_")) {
          next(new appError("invalid token",400));
        }
        const newToken = token.split("ebram_")[1]
        if(!newToken){
            next(new appError("invalid token", 400))
        }
        const decoded = jwt.verify(newToken, process.env.signatureSignIn);
        if(!decoded?.email){
            next(new appError("invalid token", 400))
        }
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
          next(new appError("user not found", 404));
        }
        if(user.status === "offline"){
            next(new appError("user should sign in first", 400))
        }
        // authorization
        if(!roles.includes(user.role)){
            next(new appError("you don't have permission", 401))
        }
        req.user = user;
        next();
    } catch (error) {
        next(new appError("catched error in auth", 400))
    }
  };
};
