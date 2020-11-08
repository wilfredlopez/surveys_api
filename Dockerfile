FROM node:10-alpine as build

WORKDIR /usr/src/app

COPY package.json .
# COPY yarn.lock .
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/shared
RUN yarn build

WORKDIR /usr/src/app/packages/api
RUN yarn build

FROM node:10-alpine

WORKDIR /usr/src/app

COPY package.json .
# COPY yarn.lock .

COPY --from=build /usr/src/app/packages/shared/package.json /usr/src/app/packages/shared/package.json
COPY --from=build /usr/src/app/packages/shared/tsconfig.json /usr/src/app/packages/shared/tsconfig.json
COPY --from=build /usr/src/app/packages/shared/src /usr/src/app/packages/shared/src
COPY --from=build /usr/src/app/packages/shared/dist /usr/src/app/packages/shared/dist

COPY --from=build /usr/src/app/packages/api/package.json /usr/src/app/packages/api/package.json
COPY --from=build /usr/src/app/packages/api/tsconfig.json /usr/src/app/packages/api/tsconfig.json
COPY --from=build /usr/src/app/packages/api/wait-for.sh /usr/src/app/packages/api/wait-for.sh
COPY --from=build /usr/src/app/packages/api/src /usr/src/app/packages/api/src
COPY --from=build /usr/src/app/packages/api/dist /usr/src/app/packages/api/dist

# ENV NODE_ENV production
ENV NODE_ENV development

# RUN yarn install --pure-lockfile --non-interactive --production
RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/api

EXPOSE 5200

# CMD [ "npm", "run", "dev" ]
RUN npm run build
# CMD [ "node", "dist/index.js" ]
CMD ["npm", "start"]
