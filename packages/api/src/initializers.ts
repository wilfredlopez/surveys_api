import apiUtils from "./apiUtils";
import { Repository } from "./app";
import { UserHelper } from "./helpers";

async function initializeAdminUser() {
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
    return;
  }
  const password = await apiUtils.hashPassword(admin.password);
  admin.password = password;
  const user = Repository.userRepository.create(admin);
  await Repository.userRepository.persistAndFlush(user);
  return;
}

export default async function initializers() {
  await initializeAdminUser();

  console.log("Initializers Successfully run.");
}
