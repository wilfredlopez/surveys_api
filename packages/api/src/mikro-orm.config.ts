import { Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MONGOURL } from "./env";
import { User, Survey, BaseEntity, SurveyQuestion } from "./entities";
// import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
// import {} from '@mikro-orm/sqlite' //needed for this

const entities = [User, Survey, BaseEntity, SurveyQuestion];

const sharedOptions: Options = {
  entities: entities,
  debug: process.env.NODE_ENV === "development",
};

export const mongoOptions: Options = {
  ...sharedOptions,
  type: "mongo",
  clientUrl: MONGOURL,
  highlighter: new MongoHighlighter(),
};
export const SqlOptions: Options = {
  ...sharedOptions,
  type: "sqlite",
  dbName: "test.db",
  // highlighter: new SqlHighlighter(),
};

export function getOptions() {
  if (process.env.NODE_ENV === "development") {
    return SqlOptions;
  } else {
    return mongoOptions;
  }
}

// const options: Options = getOptions();
const options: Options = mongoOptions;

export default options;
