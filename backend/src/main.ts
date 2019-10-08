import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import config from "./config";
import MovieModel from "./movie/movie.model";
import { searchMovie } from "./movieApi";
import userRoute from "./user/user.route";
import movieRoute from "./movie/movie.route";
import jwtStrategy from "./user/passport";
const app = express();

// Config
passport.use("jwt", jwtStrategy);
mongoose.connect(config.get("mongoUri"), { useNewUrlParser: true });

// Express Config
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/", userRoute);
app.use("/movie", movieRoute);

app.listen(config.get("port"), () =>
  console.log(`Listening on ${config.get("port")}`)
);
