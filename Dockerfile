FROM node:18 as builder

WORKDIR /app
COPY . ./

RUN yarn
RUN yarn codegen
RUN yarn build

FROM onfinality/subql-node:v3.3.0

COPY --from=builder /app/ /app/

