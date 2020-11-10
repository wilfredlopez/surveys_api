import { validateBillingInfo } from "shared";
import { SharedUtils } from "shared";

import Router from "express-promise-router";
import MyRequest from "../interfaces/index";
import { Repository } from "../app";
import { notFoundError, unauthorizedReturn } from "./controlHelper";

const router = Router();

router.post("/", async (req: MyRequest, res) => {
  const userId = req.userId!;
  if (!userId) {
    return unauthorizedReturn(res);
  }

  try {
    const user = await Repository.userRepository.findOne({ id: userId });
    if (!user) {
      return notFoundError(res, "User Not Found");
    }

    const data = req.body;

    if (!data.billing || !data.plan) {
      return res.status(400).json({
        error: `Invalid Request Body. Expected: {
                    billing: BillingInfo,
                    plan: Plan
                }`,
      });
    }
    if (!SharedUtils.isValidPlan(data.plan)) {
      return res.status(400).json({
        error: `Invalid Plan`,
      });
    }

    const [isValid, errors] = validateBillingInfo(data.billing);

    if (!isValid) {
      return res.status(400).json({
        error: "Expected valid billing info in request body.",
        invalidKeys: errors,
      });
    }

    //TODO: Place Actual Transaction
    user.plan = data.plan;

    await Repository.userRepository.persistAndFlush(user);

    return res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).json({
        error: error.message,
      });
    }
    return unauthorizedReturn(res);
  }
});

export const OrderController = router;
