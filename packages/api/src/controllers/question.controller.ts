import Router from "express-promise-router";
import { SurveyQuestionClient } from "shared";
import MyRequest from "../interfaces/index";
import { Repository } from "../app";
import { wrap } from "@mikro-orm/core";
import { ensureAuthenticated } from "../middleware/ensureAuth";

const router = Router();

router.get("/:id", ensureAuthenticated, async (req, res) => {
  const question = await Repository.surveyQuestionRepository.findOne({
    id: req.params.id,
  });

  res.json(question);
});

//Update Question
router.put("/:questionId", ensureAuthenticated, async (req: MyRequest, res) => {
  try {
    // const surveyId = req.params.id
    const questionId = req.params.questionId;
    const body = req.body as Partial<SurveyQuestionClient>;

    const question = await Repository.surveyQuestionRepository.findOne({
      id: questionId,
    });

    // const question = await SurveyQuestion.findById(questionId)
    if (!question) {
      return res.json({ error: "Survey Not Found" });
    }

    wrap(question).assign(body);
    await Repository.surveyQuestionRepository.persistAndFlush(question);
    // return res.json(await SurveyQuestion.findById(questionId))
    return res.json(question);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

router.delete("/:qid", ensureAuthenticated, async (req, res) => {
  const { qid } = req.params;

  const question = await Repository.surveyQuestionRepository.findOne({
    id: qid,
  });
  // const question = await SurveyQuestion.findById(qid)

  if (!question) {
    return res.json({
      error: "Question Not Found",
    });
  }
  await Repository.surveyRepository.removeAndFlush(question);
  return res.json({
    message: `Survey Question with id ${qid} has been removed.`,
  });
});
export const SurveyQuestionController = router;
