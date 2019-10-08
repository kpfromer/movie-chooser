import config from "../config";
import UserModel from "./user.model";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("auth.jwtSecret")
};

const Strategy = new JwtStrategy(options, (jwtPayload, done) => {
  console.log(jwtPayload);
  UserModel.findById(jwtPayload.id)
    .then(user => {
      if (user === null) {
        console.log("User not found in database.");
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch(error => done(error));
});

export default Strategy;
