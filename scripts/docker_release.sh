#!/bin/bash

set -e

docker build -t iqbberlin/teststudio-lite-frontend:latest -f docker/Dockerfile .
docker push iqbberlin/teststudio-lite-frontend:latest;

if [[ $1 == "-t" ]] && [[ $2 != "" ]]
  then
    echo "Releasing Tagged image $2"
    docker tag iqbberlin/teststudio-lite-frontend:latest iqbberlin/teststudio-lite-frontend:$2;
    docker push iqbberlin/teststudio-lite-frontend:$2;
  else
    echo "No tag paramater"
fi
