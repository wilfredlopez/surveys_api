import "reflect-metadata";
import "./env"; //Initialize Enviroment Variables from 'dotenv'
import getApp from "./app";

// Idea From: https://www.florin-pop.com/blog/2019/03/15-plus-app-ideas-to-build-to-level-up-your-coding-skills/
export const PORT = process.env.PORT || 5200;

async function init() {
  const app = await getApp();
  app.listen(PORT, () => {
    console.log(`App ready. Listening on port ${PORT}`);
  });
}
init();
