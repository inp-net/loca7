#!/bin/sh
pnpm prisma migrate deploy
pnpm prisma generate
pnpm build
pnpm start
