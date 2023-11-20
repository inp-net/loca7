# Contribution guide

## Setting up your environment

### Prerequisites

You'll need:

- [PNPM](https://pnpm.js.org) — Node package manager. A superior NPM. Using this is required to develop on loca7, since the project has a pnpm-specific lockfile.
- [Docker](https://docker.com), or a MySQL server — Container management system-we'll only use it to install a MySQL server.
- [Git](https://git-scm.org) — I hope you know what this is
- [Mailhog](https://github.com/mailhog/MailHog#installation) — debug email client that catches all mail

### Getting the source code

```bash
git clone https://git.inpt.fr/inp-net/loca7
cd loca7
```

### Installing dependencies

```bash
pnpm i
```

### Filling out the .env file

Create a new `.env` file at the project's root, and fill it out with this:

```bash
DATABASE_URL=mysql://root:root@localhost:3306/loca7 # or whatever your connection string is.
# note that if you change any of the MAIL_* values, you have to change them in mailhog/
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USER=test
MAIL_PASS=test
PUBLIC_CAS_URL=https://cas.dev.inpt.fr
OPENROUTESERVICE_KEY=... # see https://openrouteservice.org -- the API is completely free
```

### Setting up the database

1. Install mysql (skip this if you already have a MySQL installation)

```bash
docker run --name loca7-mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 --mount source=mysql,target=/var/lib/mysql -d mysql
```

2. Create database & allow all hosts to access root user

```sh-session
$ docker exec -it loca7-mysql mysql -u root -p
Enter password: root
mysql> create database loca7;
mysql> update mysql.user set host='%' where host='localhost' and user='root';
mysql> flush privileges;
```

3. Create tables

```bash
pnpm prisma migrate reset
```

4. Seed with data (optional)

For now, contact me via email to obtain a zip file of seeding data. Then:

```bash
pnpm prisma db seed
```

## Launching

1. Launch the database (if it's not already up)

```bash
docker start loca7-mysql
```

2. Launch the mailhog server

```bash
pnpm mailhog &
```

3. Launch the SvelteKit server

```bash
pnpm dev
```

## Editing the database manually and recieving mails via mailhog

1. Launch prisma studio

```bash
pnpm prisma studio
```

2. The mailhog client is on `http://localhost:8025`