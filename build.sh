#!/usr/bin/env bash

npm run build -- --prod
cd projects/library
npm run build
