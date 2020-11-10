import { QueryOrder, wrap } from "@mikro-orm/core";
import { Request, Response } from "express";
import Router from "express-promise-router";
import { UserInput, Plan } from "shared";
import apiUtils from "../apiUtils";
import { Repository } from "../app";
import { User } from "../entities";
import { UserHelper } from "../helpers";
import MyRequest from "../interfaces/index";
import { ensureAdmin } from "../middleware/ensureAdmin";
import { ensureAuthenticated } from "../middleware/ensureAuth";
import {
  isAdminOrIsSameUser,
  unauthorizedReturn,
  notFoundError,
} from "./controlHelper";
import { ControllerRoutes } from "./ControllerRoutes";
import { unknownError } from "./controlHelper";
import { SharedUtils } from "../../../shared/src/interfaces/SharedUtils";

const router = Router();

const UserControllerRoutes = new ControllerRoutes("/user", {
  me: "/me",
  all: "/",
  getOne: "/:id",
  updatedOne: "/:id",
  login: "/login",
  register: "/",
  deleteUser: "/:id",
  makeAdmin: "/admin/:id",
  updatePlan: "/plan/:userId",
});

router.get(
  UserControllerRoutes.path("all"),
  ensureAdmin,
  async (_req: Request, res: Response) => {
    const users = await Repository.userRepository.findAll(
      ["surveys"],
      { name: QueryOrder.DESC },
      20
    );

    res.json(users);
  }
);

router.put(
  UserControllerRoutes.path("updatePlan"),
  ensureAdmin,
  async (req, res) => {
    const { plan } = req.body as { plan: Plan };

    if (!SharedUtils.isValidPlan(plan)) {
      return res.json({
        error: `Invalid Plan '${plan}'`,
      });
    }
    try {
      const user = await Repository.userRepository.findOne({
        id: req.params.userId,
      });

      if (!user) {
        return notFoundError(res, "User not found.");
      }

      user.plan = plan;

      Repository.userRepository.persistAndFlush(user);

      return res.json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.json({
          error: error.message,
        });
      } else {
        return unknownError(res);
      }
    }
  }
);

router.get(
  UserControllerRoutes.path("me"),
  async (req: MyRequest, res: Response) => {
    const userId = req.userId;
    if (userId) {
      // const id = new ObjectID(userId)

      try {
        const user = await Repository.userRepository.findOne({
          id: req.userId,
        });
        if (!user) {
          return res.status(404).json({
            error: "User Not Found.",
          });
        }

        return res.json({
          user: user,
          token: "",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(401).json({
            error: error.message,
          });
        }
        return unauthorizedReturn(res);
      }
    } else {
      return unauthorizedReturn(res);
    }
  }
);

router.post(
  UserControllerRoutes.path("login"),
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response
  ) => {
    try {
      const data = req.body;
      if (!data.email || !data.password) {
        return res.status(400).json({
          error: "Email and password most be sent in request body.",
        });
      }

      const user = await Repository.userRepository.findOne({
        email: data.email,
      });
      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }

      const isValidPassword = await apiUtils.isValidPassword(
        data.password,
        user.password
      );

      if (!isValidPassword) {
        return unauthorizedReturn(res);
      }

      const { accessToken } = apiUtils.createToken(user);

      return res.json({
        user: user,
        token: accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
);

router.get(
  UserControllerRoutes.path("getOne"),
  async (req: Request, res: Response) => {
    try {
      const user = await Repository.userRepository.findOne(req.params.id, [
        "books",
      ]);

      if (!user) {
        return res.status(404).json({ message: "Author not found" });
      }

      return res.json(user);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }
);

router.post(
  UserControllerRoutes.path("register"),
  async (req: MyRequest<{}, {}, UserInput>, res: Response) => {
    const data = req.body;
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
      const user = new User(rawUser);
      wrap(user).assign(req.body);
      await Repository.userRepository.persistAndFlush(user);
      const { accessToken } = apiUtils.createToken(user);
      return res.json({
        user: user,
        token: accessToken,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        });
      } else {
        return res.status(500).json({
          error: "Could not register user.",
        });
      }
    }
  }
);

router.put(
  UserControllerRoutes.path("updatedOne"),
  ensureAuthenticated,
  async (req: MyRequest, res: Response) => {
    const ALLOWEDUPDATEDS: (keyof User)[] = [
      "email",
      "firstname",
      "lastname",
      "password",
      "avatar",
    ];

    const data = req.body as User;

    for (let key in data) {
      if (!ALLOWEDUPDATEDS.includes(key as any)) {
        try {
          delete data[key as keyof User];
        } catch (error) {}
      }
    }

    const hasKeys = Object.keys(data);

    if (hasKeys.length === 0) {
      return res.status(400).json({
        error: "No Updates to make",
        allowedProperties: ALLOWEDUPDATEDS,
      });
    }

    console.log({ hasKeys });

    try {
      const user = await Repository.userRepository.findOne(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (data.password) {
        data.password = await apiUtils.hashPassword(data.password);
      }

      if (!isAdminOrIsSameUser(user, req.userId!)) {
        return unauthorizedReturn(res);
      }

      wrap(user).assign(data);
      await Repository.userRepository.persistAndFlush(user);

      return res.json(user);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }
);

router.delete(
  UserControllerRoutes.path("deleteUser"),
  ensureAuthenticated,
  async (req: MyRequest, res) => {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return unauthorizedReturn(res);
    }

    const user = await Repository.userRepository.findOne(userId);

    // const user = await User.findOne({
    //   _id: id,
    // })

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    if (isAdminOrIsSameUser(user, id)) {
      if (userId === id) {
        await Repository.userRepository.removeAndFlush(user);
      } else {
        const client = await Repository.userRepository.findOne({ id });
        if (!client) {
          return notFoundError(res, `User not found with id ${id}`);
        }

        await Repository.userRepository.removeAndFlush(client);
      }
      return res.json({
        message: `User with id ${id} successfully deleted`,
      });
    } else {
      return unauthorizedReturn(res);
    }
  }
);

router.post(
  UserControllerRoutes.path("makeAdmin"),
  async (req: MyRequest, res) => {
    const id = req.params.id;
    const administrator = await Repository.userRepository.findOne({
      id: req.userId,
    });
    // const administrator = await User.findOne({
    //   _id: req.userId,
    // })

    if (!administrator || !administrator.isAdmin) {
      return unauthorizedReturn(
        res,
        "You Most be an administrator in order to perform this request"
      );
    }

    try {
      const user = await Repository.userRepository.findOne({ id: id });

      if (!user) {
        return res.json({
          error: "User Not Found.",
        });
      }
      user.isAdmin = true;
      await Repository.userRepository.persistAndFlush(user);
      return res.json({
        user: user,
        token: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        });
      } else {
        return res.status(500).json({
          error: "Internal server error.",
        });
      }
    }
  }
);

export const UserController = router;
