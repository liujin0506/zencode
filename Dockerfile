FROM node:17.7.2-alpine3.15

COPY . /data/release/zencode/

RUN apk --update add libtool automake autoconf nasm gcc make g++ zlib-dev

RUN npm install -g next \
    && export NODE_OPTIONS=--openssl-legacy-provider \
    && cd /data/release/zencode/ \
    && yarn install \
    && npm run build

WORKDIR /data/release/zencode/
EXPOSE 3000

CMD [ "npm", "run", "start" ]
