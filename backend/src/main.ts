import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import MovieModel from "./movie.model";
import { searchMovie } from "./movieApi";

const app = express();

mongoose.connect(config.get("mongoUri"), { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(cors());

const asyncMid = (fn: (req: Request, res: Response) => Promise<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => fn(req, res).catch(error => next(error));

app.get(
  "/",
  asyncMid(async (req, res) => {
    const movies = await MovieModel.find({}).exec();
    res.json({
      success: true,
      data: movies
    });
  })
);

app.post(
  "/",
  asyncMid(async (req, res) => {
    const apiMovie = await searchMovie(req.body.movie);
    const data = await MovieModel.create(
      apiMovie !== null
        ? { name: req.body.movie, details: apiMovie }
        : { name: req.body.movie }
    );
    res.json({
      success: true,
      data
    });
  })
);

app.delete(
  "/:id",
  asyncMid(async (req, res) => {
    const data = await MovieModel.findByIdAndDelete(req.params.id).exec();
    // TODO: data === null
    res.json({ success: true, data });
  })
);

app.listen(config.get("port"), () =>
  console.log(`Listening on ${config.get("port")}`)
);
