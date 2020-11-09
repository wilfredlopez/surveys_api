import { Request, Response } from "express";
import Router from "express-promise-router";
import { QueryOrder, wrap } from "@mikro-orm/core";

import { Repository } from "../app";
import { User } from "../entities";
import { UserInput } from "shared";
import { UserHelper } from "../helpers";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const authors = await Repository.userRepository.findAll(
    ["books"],
    { name: QueryOrder.DESC },
    20
  );
  res.json(authors);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const author = await Repository.userRepository.findOne(req.params.id, [
      "books",
    ]);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.json(author);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  if (!req.body.firstname || !req.body.email) {
    res.status(400);
    return res.json({ message: "One of `name, email` is missing" });
  }

  const data = req.body as UserInput;
  const [isValidUser, errMessage] = UserHelper.isValidUserInput(data);
  if (!isValidUser) {
    return res.status(400).json({
      error: errMessage,
    });
  }
  //Prevent Setting Admin and Plan for User
  data.isAdmin = false;
  data.plan = "trial";
  const rawUser = new UserHelper(data);
  await rawUser.hashPassword();

  try {
    const author = new User(rawUser);
    wrap(author).assign(req.body);
    await Repository.userRepository.persistAndFlush(author);

    return res.json(author);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const author = await Repository.userRepository.findOne(req.params.id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    wrap(author).assign(req.body);
    await Repository.userRepository.persist(author);

    return res.json(author);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

export const UserController = router;
