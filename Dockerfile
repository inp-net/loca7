from gplane/pnpm

workdir /app

copy package.json .npmrc pnpm-lock.yaml ./
run pnpm install

copy . .
copy .env.docker .env
run chmod +x entrypoint.sh

entrypoint ["./entrypoint.sh"]
