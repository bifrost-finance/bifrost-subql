#!/bin/bash

git clone -b monitor https://github.com/bifrost-finance/salp-confirm-polkadot-subql .polkadot
git clone -b monitor https://github.com/bifrost-finance/salp-confirm-kusama-subql .kusama

cd .kusama && yarn install && yarn codegen && yarn build && cd ..
cd .polkadot && yarn install && yarn codegen && yarn build