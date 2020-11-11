import apiUtils from "./apiUtils";
import { Repository } from "./app";
import { UserHelper } from "./helpers";

export async function resetDatabase() {
  await Repository.surveyRepository.nativeDelete({});
  await Repository.surveyQuestionRepository.nativeDelete({});
  await Repository.userRepository.nativeDelete({});
}

export async function initializeAdminUser() {
  const admin = new UserHelper({
    email: "test@test.com",
    firstname: "Wilfred",
    lastname: "Lopez",
    password: "password",
    isAdmin: true,
  });
  const exists = await Repository.userRepository.findOne({
    email: admin.email,
  });

  if (exists) {
    // console.log({ exists });

    // await Repository.userRepository.nativeDelete({ email: admin.email });
    return;
  }
  const password = await apiUtils.hashPassword(admin.password);
  admin.password = password;
  const user = Repository.userRepository.create(admin);
  await Repository.userRepository.persistAndFlush(user);
  return;
}

export default async function initializers() {
  // await resetDatabase();
  await initializeAdminUser();

  console.log("Initializers Successfully run.");
}
