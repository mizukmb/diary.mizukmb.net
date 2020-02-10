FROM node:13

ARG NPM_RUN_COMMAND=dev
ENV NRC $NPM_RUN_COMMAND

WORKDIR /node/app
COPY . .

RUN ["npm", "install"]

CMD ["sh", "-c", "npm run $NRC"]
