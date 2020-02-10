FROM node:13

WORKDIR /node/app
COPY . .

RUN ["npm", "install"]

CMD ["npx", "parcel", "--hmr-port", "5050", "--hmr-hostname", "localhost", "./index.html"]
