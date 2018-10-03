#!/usr/bin/env bash

cd node/

npm start &

cd ..

source ~/venv/FK/bin/activate

cd python

python server.py