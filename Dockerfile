FROM node:17.7.2-alpine3.15

COPY . /data/release/transform/

RUN npm install -g next \
    && export NODE_OPTIONS=--openssl-legacy-provider \
    && cd /data/release/transform/ \
    && npm run build

WORKDIR /data/release/transform/
EXPOSE 3000

CMD [ "npm", "run", "start" ]
