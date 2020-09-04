FROM node:10-stretch as builder
WORKDIR /app
ADD . .
RUN mkdir -p /app/log
RUN yarn install --network-timeout 100000 && yarn build

FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/lib /app/lib
ENV NODE_CONFIG /app/config/pom.yaml
ENV NODE_SECRET /app/secret/pom.yaml
