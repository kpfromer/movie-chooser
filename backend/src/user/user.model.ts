import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { Movie } from "../movie/movie.model";

class User extends Typegoose {
  @prop({ required: true, unique: true })
  public username: string = "";

  @prop({ required: true })
  public firstName: string = "";

  @prop({ required: true })
  public lastName: string = "";

  @prop({ required: true })
  public password: string = "";

  @arrayProp({ itemsRef: Movie, required: true })
  public movies: Ref<Movie>[] = [];
}

const UserModel = new User().getModelForClass(User);

export default UserModel;
