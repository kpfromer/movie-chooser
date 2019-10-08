import express from "express";
import passport from "passport";
import MovieModel, { Movie } from "../movie/movie.model";
import asyncMid from "../middleware/asyncMid";
import { getMovie, searchMovie } from "../movieApi";
import UserModel from "../user/user.model";
import { ModelType } from "typegoose";

const router = express.Router();

router.get(
  "/",
  asyncMid(async (req, res) => {
    const users = await UserModel.find({})
      .populate("movies")
      .exec();
    res.json({
      success: true,
      data: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        movies: user.movies
      }))
    });
  })
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncMid(async (req, res) => {
    const apiMovie = await searchMovie(req.body.movie);
    const data = await MovieModel.create(
      apiMovie !== null
        ? { name: req.body.movie, details: apiMovie }
        : { name: req.body.movie }
    );

    await UserModel.findByIdAndUpdate(req.user!._id, {
      $addToSet: {
        movies: data._id
      }
    }).exec();

    res.json({
      success: true,
      data
    });
  })
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncMid(async (req, res) => {
    const user = await UserModel.findById(req.user!._id)
      .populate("movies")
      .exec();
    if (!!user) {
      const foundMovie = user.movies.find(
        movie =>
          (movie as InstanceType<ModelType<Movie>>)._id.toString() ===
          req.params.id
      );
      if (foundMovie !== undefined) {
        await UserModel.findByIdAndUpdate(req.user!._id, {
          $pull: {
            movies: req.params.id
          }
        }).exec();
        return res.json({ success: true });
      } else {
        return res.status(404).json({
          success: false,
          message: "Movie was not created by user or does not exist."
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User does not exist."
      });
    }
  })
);

const wait = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

router.get(
  "/update",
  asyncMid(async (req, res) => {
    const movies = await MovieModel.find().exec();
    for (let movie of movies /*.filter(movie => movie.version === "0") */) {
      const details = await searchMovie(movie.name);
      await movie.update({ $set: { details, version: "1" } }).exec();
      await wait(1000);
    }
    res.json({ success: "Done Updating" });
  })
);

export default router;
