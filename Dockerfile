# Install dependencies only when needed
FROM node:18-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache libc6-compat git libtool automake autoconf nasm gcc make g++ zlib-dev supervisor && export NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app
COPY . ./
RUN yarn config set registry https://registry.npm.taobao.org && yarn install --frozen-lockfile  && export NODE_OPTIONS=--openssl-legacy-provider && yarn build


ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

EXPOSE 3000

ENV PORT 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]