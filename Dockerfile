FROM onfinality/subql-node:v3.3.0
WORKDIR /app
COPY . .
RUN  yarn install && yarn codegen && yarn build

# TODO: remove depedences

Entrypoint  ["/sbin/tini","--","/usr/local/lib/node_modules/@subql/node/bin/run"]
