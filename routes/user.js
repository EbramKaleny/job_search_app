import express from "express";
import * as UC from "../controllers/user.js";
import * as UV from "../validators/user.js";
import { validation } from "../middlewares/validation.js";
import { auth } from "../middlewares/auth.js";
import { tokenValidation } from "../validators/generalValidation.js";

const router = express.Router();

router.route("/signup").post(validation(UV.signUpValidation), UC.signUp);
router.route("/signin").put(validation(UV.signInValidation), UC.signIn);
router
  .route("/updateAccount")
  .put(validation(UV.updateAccountValidation), auth(), UC.updateAccount);
router
  .route("/deleteAccount")
  .delete(validation(tokenValidation), auth(), UC.deleteAccount);
router
  .route("/userData")
  .get(validation(tokenValidation), auth(), UC.getUserAccountData);
router
  .route("/accountsToRecoveryEmail")
  .get(
    validation(UV.accountsAssociatedToRecoveryEmailValidation),
    auth(),
    UC.accountsAssociatedToRecoveryEmail
  );
router
  .route("/updatePassword/:token")
  .put(validation(UV.updatePasswordValidation), UC.updatePassword);
router
  .route("/forgetPassword")
  .put(validation(UV.forgetPasswordValidation), UC.forgetPassword);

router
  .route("/userDataForAnotherUser")
  .get(
    validation(UV.getProfileForAnotherUserValidation),
    auth(),
    UC.getProfileForAnotherUser
  );

export default router;
