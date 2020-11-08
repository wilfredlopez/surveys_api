import { RequestHandler } from 'express'
import { User } from '../../entities/User'
import MyRequest from '../../interfaces/MyRequest'
import { BaseRoute } from '../BaseRoute'
import { validateBillingInfo } from 'shared'
import { PlaceOrderRequesInput } from 'shared'
import { SharedUtils } from 'shared'

class OrderRoutes extends BaseRoute {
  placeOrder: RequestHandler = async (
    req: MyRequest<{}, {}, PlaceOrderRequesInput>,
    res
  ) => {
    const userId = req.userId!
    if (!userId) {
      return this.unauthorizedReturn(res)
    }

    try {
      const user = await User.findOne(userId)
      if (!user) {
        return this.notFoundError(res, 'User Not Found')
      }

      const data = req.body

      if (!data.billing || !data.plan) {
        return res.status(400).json({
          error: `Invalid Request Body. Expected: {
                    billing: BillingInfo,
                    plan: Plan
                }`,
        })
      }
      if (!SharedUtils.isValidPlan(data.plan)) {
        return res.status(400).json({
          error: `Invalid Plan`,
        })
      }

      const [isValid, errors] = validateBillingInfo(data.billing)

      if (!isValid) {
        return res.status(400).json({
          error: 'Expected valid billing info in request body.',
          invalidKeys: errors,
        })
      }

      //TODO: Place Actual Transaction
      user.plan = data.plan

      await user.save()

      return res.json(user)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(401).json({
          error: error.message,
        })
      }
      return this.unauthorizedReturn(res)
    }
  }
}

const orderRoutes = new OrderRoutes()

export default orderRoutes
