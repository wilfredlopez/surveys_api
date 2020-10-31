
FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY yarn*.lock ./

USER node

RUN yarn

COPY --chown=node:node . .

# EXPOSE 8080
EXPOSE 5200

# CMD [ "npm", "run", "dev" ]
RUN npm run build
CMD [ "node", "dist/index.js" ]