import { Typegoose, prop } from "typegoose";

class Movie extends Typegoose {
  @prop({ required: true })
  public name: string = "";

  @prop()
  public tags?: string[];
}

const MovieModel = new Movie().getModelForClass(Movie);

export default MovieModel;
