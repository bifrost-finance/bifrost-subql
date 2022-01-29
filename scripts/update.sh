#!/bin/bash

cd .kusama && git pull && yarn install && yarn codegen && yarn build && cd ..
cd .polkadot && git pull && yarn install && yarn codegen && yarn build
