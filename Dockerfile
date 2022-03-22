FROM node:17.7.2-alpine3.15

COPY . /data/release/transform/

RUN npm install -g next \
    && yarn add --dev typescript @types/react @types/node \
    && export NODE_OPTIONS=--openssl-legacy-provider \
    && cd /data/release/transform/ \
    && npm run build

WORKDIR /data/release/transform/
EXPOSE 3000

CMD [ "npm", "run", "start" ]
