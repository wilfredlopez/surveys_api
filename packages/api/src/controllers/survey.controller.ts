import { Request, Response } from "express";
import Router from "express-promise-router";
import { QueryOrder, wrap } from "@mikro-orm/core";
import { Repository } from "../app";
import { Survey } from "../entities";
import { ExpectedCreate, SharedUtils } from "shared";
import { SurveyQuestionHelper } from "../helpers";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const books = await Repository.surveyRepository.findAll(
    ["questions"],
    { name: QueryOrder.DESC },
    20
  );

  res.json({ books });
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Repository.surveyRepository.findOne(req.params.id, [
      "questions",
    ]);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(book);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.creator) {
    res.status(400);
    return res.json({ message: "One of `name, creator` is missing" });
  }

  try {
    const data = req.body as ExpectedCreate & { creator: any };
    const userId = data.creator;

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

    //NOT NEEDED :)
    // const questions = await SurveyQuestion.create(raw_questions)
    // for (const q of questions) {
    //   q.save()
    // }

    const questions = Repository.surveyQuestionRepository.create(raw_questions);

    let newSurvey = {
      ...defaultValues,
      ...data,
      questions: questions,
      creatorId: userId,
    };

    const book = new Survey({
      ...newSurvey,
      creator: userId as any,
    });
    wrap(book).assign(req.body, { em: Repository.em });
    await Repository.surveyRepository.persistAndFlush(book);

    return res.json(book);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Repository.surveyRepository.findOne(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    wrap(book).assign(req.body);
    await Repository.surveyRepository.persist(book);

    return res.json(book);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

export const SurveyController = router;
