import { Typegoose, prop } from "typegoose";
import { Movie as MovieDetails } from "../movieApi";

export class Movie extends Typegoose {
  @prop({ required: true })
  public name: string = "";

  @prop()
  public tags?: string[];

  @prop()
  public details?: MovieDetails;

  @prop({ required: true, default: "1" })
  public version: string = "";
}

const MovieModel = new Movie().getModelForClass(Movie);

export default MovieModel;
