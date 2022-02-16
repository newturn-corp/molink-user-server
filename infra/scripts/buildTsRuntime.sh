#!/bin/bash
echo "Build Ts Package"
cd /home/ubuntu/user
# production packages
rm -r build

sleep 1

npm run build
