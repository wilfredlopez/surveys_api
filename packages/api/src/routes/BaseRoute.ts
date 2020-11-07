import { Response } from 'express'

export abstract class BaseRoute {
  protected unauthorizedReturn(res: Response, message = 'Unauthorized') {
    return res.status(401).json({
      error: message,
    })
  }
  protected unknownError<Err extends { error: string }>(
    res: Response,
    data?: Err
  ) {
    return res.status(500).json(
      data || {
        error: 'Internal Server Error',
      }
    )
  }
  protected notFoundError(res: Response, message = 'Not Found') {
    return res.status(404).json({
      error: message,
    })
  }
}
