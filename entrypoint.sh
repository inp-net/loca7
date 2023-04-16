#!/bin/sh
cd /app
npx prisma migrate deploy
node build/index.js