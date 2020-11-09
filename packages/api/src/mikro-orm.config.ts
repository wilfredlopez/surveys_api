import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MONGOURL } from "./env";
import { User, Survey, BaseEntity, SurveyQuestion } from "./entities";

const options: Options = {
  type: "mongo",
  entities: [User, Survey, BaseEntity, SurveyQuestion],
  // dbName: MONGO_DB,
  clientUrl: MONGOURL,

  highlighter: new MongoHighlighter(),
  debug: true,
};

export default options;
