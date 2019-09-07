import { Typegoose, prop } from "typegoose";
import { Movie as MovieDetails } from "./movieApi";

class Movie extends Typegoose {
  @prop({ required: true })
  public name: string = "";

  @prop()
  public tags?: string[];

  @prop()
  public details?: MovieDetails;
}

const MovieModel = new Movie().getModelForClass(Movie);

export default MovieModel;
