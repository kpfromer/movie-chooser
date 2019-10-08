import express from "express";
import joi from "joi";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import UserModel from "./user.model";
import asyncMid from "../middleware/asyncMid";
import config from "../config";
import { joiValidate } from "../middleware/joiValidate";

const router = express.Router();

const registerDto = joi
  .object({
    username: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    password: joi.string().required()
  })
  .required();

router.post(
  "/register",
  joiValidate(registerDto),
  asyncMid(async (req, res) => {
    const userInDb = await UserModel.findOne({
      username: req.body.user
    }).exec();

    if (userInDb !== null) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken."
      });
    }

    const hashedPassword = await bcryptjs.hash(
      req.body.password,
      config.get("auth.brcyptSaltRounds")
    );

    await UserModel.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    return res.json({
      success: true,
      message: "Created user."
    });
  })
);

const loginDto = joi
  .object({
    username: joi.string().required(),
    password: joi.string().required()
  })
  .required();

router.post(
  "/login",
  joiValidate(loginDto),
  asyncMid(async (req, res) => {
    const user = await UserModel.findOne({
      username: req.body.username
    }).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username/password does not match"
      });
    }

    const matches = await bcryptjs.compare(req.body.password, user.password);

    if (!matches) {
      return res.status(404).json({
        success: false,
        message: "Username/password does not match."
      });
    }

    const token = jwt.sign({ id: user._id }, config.get("auth.jwtSecret"), {
      expiresIn: "1h"
    });
    return res.json({
      success: true,
      data: { token }
    });
  })
);

export default router;
