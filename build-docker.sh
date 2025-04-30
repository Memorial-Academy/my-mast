#! /bin/bash
# Build admin image
docker build -t mymast-admin . --target=deploy-admin
# Build server image
docker build -t mymast-server . --target=deploy-server
# Build client image
docker build -t mymast-client . --target=deploy-client