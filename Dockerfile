FROM node:18-alpine
run apk add --no-cache --update openssl

workdir /app

copy package.json ./
copy .npmrc ./
run npm install --loglevel verbose

copy . .
run chmod +x entrypoint.sh
run npx prisma generate
run npm run build

expose 3000
entrypoint ["/app/entrypoint.sh"]
