FROM node:17.7.2-alpine3.15

COPY . /data/release/zencode/

RUN apk add autoconf

RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g next \
    && export NODE_OPTIONS=--openssl-legacy-provider \
    && cd /data/release/zencode/ \
    && npm install \
    && npm run build

WORKDIR /data/release/zencode/
EXPOSE 3000

CMD [ "npm", "run", "start" ]
