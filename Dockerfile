FROM node:17.7.2-alpine3.15

COPY . /data/release/zencode/

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk --update add libtool automake autoconf nasm gcc make g++ zlib-dev git

RUN npm install -g next \
    && export NODE_OPTIONS=--openssl-legacy-provider \
    && cd /data/release/zencode/ \
    && npm --registry=https://registry.npmmirror.com i \
    && npm run build

WORKDIR /data/release/zencode/
EXPOSE 3000

CMD [ "npm", "run", "start" ]
