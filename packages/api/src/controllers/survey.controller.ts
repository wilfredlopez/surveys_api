import { QueryOrder, wrap } from "@mikro-orm/core";
import { Request, Response } from "express";
import Router from "express-promise-router";
import {
  ExpectedCreate,
  SharedUtils,
  SurveyQuestionClient,
  SurveyResponseInput,
} from "shared";
import { ensureAdmin } from "../middleware/ensureAdmin";
import { Repository } from "../app";
import { Survey } from "../entities";
import { SurveyQuestionHelper } from "../helpers";
import MyRequest from "../interfaces/index";
import { deleteProp, unknownError, validateClientKey } from "./controlHelper";
import { SurveyQuestion } from "../entities/SurveyQuestion";
import { ensureAuthenticated } from "../middleware/ensureAuth";
import { maybeAdmin } from "../middleware/maybeAdmin";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const client = await validateClientKey(req.query.publicKey as string);
    if (typeof client === "string") {
      return res.status(404).json({
        error: client,
      });
    }
    const surveys = await Repository.surveyRepository.find(
      {
        open: true,
        creator: client.id,
      },
      ["questions"],
      { name: QueryOrder.DESC }
    );

    return res.json({ surveys: surveys });
  } catch (error) {
    console.error(error);

    return unknownError(res, {
      surveys: [],
      error: "Internal Server Error",
    });
  }
});

router.get("/all", ensureAdmin, async (_req, res) => {
  try {
    const surveys = await Repository.surveyRepository.findAll(["creator"]);

    return res.json({
      surveys: surveys,
    });
  } catch (error) {
    console.error(error);
    return unknownError(res, {
      surveys: [],
      error: "Internal Server Error.",
    });
  }
});

router.get("/mysurveys", async (req: MyRequest, res) => {
  const id = req.userId;
  const surveys = await Repository.surveyRepository.find({ creator: id }, [
    "questions",
  ]);

  res.json(surveys);
});

router.get("/:id", async (req: Request, res: Response) => {
  const client = await validateClientKey(req.query.publicKey as string);
  if (typeof client === "string") {
    return res.status(404).json({
      error: client,
    });
  }
  try {
    const survey = await Repository.surveyRepository.findOne(
      {
        id: req.params.id,
        creator: client._id,
      },
      ["questions"]
    );

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    return res.json(survey);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.post("/", ensureAuthenticated, async (req: MyRequest, res: Response) => {
  try {
    const data = req.body as ExpectedCreate & { creator: any };
    const userId = req.userId!;
    if (!data.open) {
      data.open = false;
    }

    const [error, isValidData] = SharedUtils.validateCreate(data);
    if (!isValidData) {
      return res.status(400).json({
        error: error,
      });
    }
    const exists = await Repository.surveyRepository.findOne({
      name: data.name,
    });

    if (exists) {
      return res.status(400).json({
        error: "Survey with that name already exists.",
      });
    }

    const raw_questions = SurveyQuestionHelper.transformQuestions(
      data.questions
    );

    const defaultValues = {
      open: false,
    };

    let newSurvey = {
      ...defaultValues,
      ...data,
      creatorId: userId,
    };

    const survey = new Survey({
      ...newSurvey,
      creator: userId as any,
    });

    wrap(survey).assign(survey, { em: Repository.em });
    await Repository.surveyRepository.persistAndFlush(survey);
    for (let q of raw_questions) {
      const created = new SurveyQuestion({
        ...q,
        survey: survey,
      });
      await wrap(created).assign(created, { em: Repository.em });
      await Repository.surveyQuestionRepository.persistAndFlush(created);
    }
    return res.json(survey);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const valuesToUpdate = req.body || {};

    const protectedProps = ["_id", "creator", "creatorId"];
    for (const key of protectedProps) {
      deleteProp(valuesToUpdate, key);
    }

    const survey = await Repository.surveyRepository.findOne({
      id: id,
    });

    if (!survey) {
      res.status(404).json({
        error: "Survey not found.",
      });
      return;
    }

    if (valuesToUpdate.questions) {
      if (!SharedUtils.isSurveyQuestionInput(valuesToUpdate.questions)) {
        res.status(400).json({
          error: "Invalid Questions input.",
        });
        return;
      }
      function isInvalidID(_id: any): _id is string {
        return typeof _id === "undefined" || _id === "";
      }
      if (Array.isArray(valuesToUpdate.questions)) {
        const nonExistingQuestions = (valuesToUpdate.questions as SurveyQuestionClient[]).filter(
          (q) => isInvalidID(q._id)
        );
        const raw_questions = SurveyQuestionHelper.transformQuestions(
          nonExistingQuestions
        );

        for (let q of raw_questions) {
          const question = new SurveyQuestion({ ...q, survey: survey });
          await Repository.surveyQuestionRepository.persistAndFlush(question);
        }
      }
    }

    delete valuesToUpdate.questions;

    const updated = await Repository.surveyRepository.assign(
      survey,
      valuesToUpdate
    );
    await Repository.surveyRepository.persistAndFlush(updated);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error.",
    });
  }
});

router.delete(
  "/:id",
  ensureAuthenticated,
  maybeAdmin,
  async (req: MyRequest, res) => {
    const id = req.params.id as string;

    let query = {
      id: id,
      creator: req.userId as any,
    };
    if (req.admin) {
      delete query.creator;
    }

    const survey = await Repository.surveyRepository.findOne(query);

    if (!survey) {
      return res.status(404).json({
        error: "Survey Not Found",
      });
    }

    // const questions: string[] = (survey.questions as any) || [];

    // for (let q of questions) {
    //   const qa = Repository.surveyQuestionRepository.remove({
    //     id: q,
    //   });
    //   await Repository.surveyQuestionRepository.persistAndFlush(qa);
    // }

    const deleted = await Repository.surveyRepository.nativeDelete({
      id: survey.id,
    });

    return res.json({ survey, deleted });
  }
);

router.put("/answer/:id", async (req, res) => {
  try {
    const id = req.params.id as string;
    const survey = await Repository.surveyRepository.findOne({ id });
    if (!survey) {
      res.status(404).json({
        error: "Survey Not Found",
      });
      return;
    }
    const answers = req.body as SurveyResponseInput;

    if (SurveyQuestionHelper.isValidAnswerInput(answers) === false) {
      res.status(400).json({
        error: `Invalid request. Please send an array with {
        questionId: string
        answer: string[]
      }`,
        received: answers,
      });

      return;
    }

    const questions = [];

    for (let answer of answers) {
      const question = await Repository.surveyQuestionRepository.findOne({
        id: answer.questionId,
      });

      if (question) {
        if (!question.answers) {
          question.answers = [];
        }

        const ansssss: string[] = question.answers;
        for (let val of answer.answer) {
          ansssss.push(val);
        }

        await Repository.surveyQuestionRepository.nativeUpdate(
          {
            id: answer.questionId,
          },
          {
            answers: ansssss,
          }
        );
        questions.push(question);
      }
    }

    res.json({ survey, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const SurveyController = router;
