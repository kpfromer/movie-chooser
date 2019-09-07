import convict from "convict";

const config = convict({
  // env: {
  //   doc: 'The application environment.',
  //   format: ['production', 'development', 'test'],
  //   default: 'development',
  //   env: 'NODE_ENV'
  // },
  port: {
    doc: "The port to bind to",
    format: "port",
    default: 3001,
    env: "PORT"
  },
  mongoUri: {
    doc: "The mongodb connection uri",
    format: String,
    default: "mongodb://localhost/movie-chooser",
    env: "MONGO_URI"
  },
  apiKey: {
    doc: "Api key for themoviedb.",
    format: String,
    default: "none",
    env: "API_KEY"
  }
  // auth: {
  //   jwtSecret: {
  //     doc: 'The secret for the jwt tokens',
  //     format: String,
  //     default: 'jwt-secret',
  //     env: 'JWT_SECRET'
  //   },
  //   brcyptSaltRounds: {
  //     doc: 'The number of rounds to salt jwt tokens',
  //     format: Number,
  //     default: 12
  //   }
  // }
});

export default config;
