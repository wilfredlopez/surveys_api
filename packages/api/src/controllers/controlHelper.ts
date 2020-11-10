import { Response } from "express";
import { User } from "../entities/User";
import { Repository } from "../app";
import { UserHelper } from "../helpers";

export function unauthorizedReturn(res: Response, message = "Unauthorized") {
  return res.status(401).json({
    error: message,
  });
}

export function unknownError<Err extends { error: string }>(
  res: Response,
  data?: Err
) {
  return res.status(500).json(
    data || {
      error: "Internal Server Error",
    }
  );
}

export function notFoundError(res: Response, message = "Not Found") {
  return res.status(404).json({
    error: message,
  });
}

export function isAdminOrIsSameUser(user: User, id: string) {
  if (!user) {
    return false;
  }
  if (user.id === id) {
    return true;
  }
  if (user.isAdmin) {
    return true;
  }

  return false;
}

export async function validateClientKey(
  publicKey: string | undefined
): Promise<string | User> {
  if (!publicKey) {
    return "publicKey Most be sent with the request.";
  }

  const client = await Repository.userRepository.findOne({
    publicKey: publicKey,
  });

  if (!client) {
    return `Client Not found with publicKey`;
  }
  const isValidKey = UserHelper.isValidKey(client.publicKey);

  if (!isValidKey) {
    return `publicKey Expired.`;
  }
  return client;
}

export function deleteProp<T extends {} = any>(obj: T, key: keyof T) {
  if (obj[key]) {
    delete obj[key];
  }
}
