import "reflect-metadata";
import express from "express";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import cors from "cors";

import { SurveyController } from "./controllers";
import { User, Survey, SurveyQuestion } from "./entities";
import { UserController } from "./controllers/user.controller";
import { authMiddleware } from "./middleware/authMiddleware";
import { SurveyQuestionController } from "./controllers/question.controller";
import { OrderController } from "./controllers/order.controller";
import initializers from "./initializers";

export const Repository = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
  surveyRepository: EntityRepository<Survey>;
  surveyQuestionRepository: EntityRepository<SurveyQuestion>;
};

const app = express();
async function getApp() {
  //MikroOrm Middleware
  Repository.orm = await MikroORM.init();
  Repository.em = Repository.orm.em;
  Repository.userRepository = Repository.orm.em.getRepository(User);
  Repository.surveyRepository = Repository.orm.em.getRepository(Survey);
  Repository.surveyQuestionRepository = Repository.orm.em.getRepository(
    SurveyQuestion
  );

  //Middlewares
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.json());
  app.use(cors({}));

  app.use((_req, _res, next) => RequestContext.create(Repository.orm.em, next));
  //Adding req.userId
  app.use(authMiddleware);
  await initializers();

  app.get("/", (_, res) => {
    res.json({
      surveys_api: "Navigate to /surveys",
    });
  });

  app.use("/survey", SurveyController);
  app.use("/user", UserController);
  app.use("/question", SurveyQuestionController);
  app.use("/order", OrderController);
  app.use((_req, res) => res.status(404).json({ message: "No route found" }));
  return app;
}

export default getApp;
