#!/bin/bash
echo "run server"
cd /home/ubuntu/user
pm2 startOrReload /home/ubuntu/user/infra/configs/ecosystem.config.js
