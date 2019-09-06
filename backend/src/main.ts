import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as fs from "fs";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  if (!fs.existsSync(path.join(__dirname, "movies.txt"))) {
    fs.writeFileSync(path.join(__dirname, "movies.txt"), "");
  }
  fs.readFile(path.join(__dirname, "movies.txt"), (error, data) => {
    if (error) return next(error);
    return res.json({
      success: true,
      data: data
        .toString()
        .split("\n")
        .filter(line => line !== "")
    });
  });
});

app.post("/", (req, res, next) => {
  fs.appendFile(
    path.join(__dirname, "movies.txt"),
    `\n${req.body.movie}`,
    error => {
      if (error) return next(error);
      return res.json({ success: true });
    }
  );
});

app.delete("/:movie", (req, res, next) => {
  fs.readFile(path.join(__dirname, "movies.txt"), (error, data) => {
    if (error) return next(error);
    fs.writeFile(
      path.join(__dirname, "movies.txt"),
      data
        .toString()
        .split("\n")
        .filter(line => line !== req.params.movie)
        .join("\n"),
      writeError => {
        if (writeError) return next(writeError);
        return res.json({
          success: true
        });
      }
    );
  });
});

// app.listen(3003);

module.exports = app;
