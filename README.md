# micro-thesis

A microservices-based system built as part of a thesis project. It is composed
of an API gateway, several backend services, and a frontend.

## Architecture

| Component             | Description                                      |
| --------------------- | ------------------------------------------------ |
| `apiGateway`          | Entry point; routes requests and handles auth (JWT). |
| `userService`         | User management and authentication.              |
| `formService`         | Form data management.                            |
| `notificationService` | Sends notifications (e.g. email).                |
| `frontend`            | Client application (Vite).                        |

## Running the project

The whole system runs in Docker: the four services, the frontend, MongoDB,
Kafka and a local mail catcher. The only requirement is
[Docker](https://www.docker.com/).

### 1. Create the config files

Each service reads its secrets from a `config.env` file, which is **not**
committed to the repository. Every service ships a `config.env.example` listing
the required variables — copy it and fill in your own values:

```bash
cp apiGateway/config.env.example          apiGateway/config.env
cp userService/config.env.example         userService/config.env
cp formService/config.env.example         formService/config.env
cp notificationService/config.env.example notificationService/config.env
```

### 2. Start

```bash
./scripts/start.sh
```

The script starts all containers and waits until the app is reachable. The
first run takes longer, because images are downloaded and each service installs
its dependencies.

| What        | Address                     |
| ----------- | --------------------------- |
| Frontend    | http://localhost:5173       |
| API gateway | http://localhost:3000       |
| Mailbox     | http://localhost:8025       |
| MongoDB     | `mongodb://localhost:27017` |

### 3. Seed the database (first run only)

```bash
docker compose exec user-service npm run seed
docker compose exec form-service npm run seed
```

Run them in this order: the form seeder reads the employees created by the user
seeder. All seeded users have the password `a1234567890!`. Their emails are
random, so look one up in the `userService` database (for example with
[MongoDB Compass](https://www.mongodb.com/products/tools/compass)) to log in.

### 4. Stop

```bash
./scripts/stop.sh
```

The database is kept between runs. To delete it and start from scratch, run
`docker compose down -v` and seed again.

### Good to know

- **Live reload:** each service folder is mounted into its container, so code
  changes are picked up automatically.
- **Logs:** `docker compose logs -f <service>`, where `<service>` is one of
  `api-gateway`, `user-service`, `form-service`, `notification-service` or
  `frontend`.
- **Crashed service:** a crashed service waits for a file change. Save a file
  or run `docker compose restart <service>`.
- **New npm package:** restart the service afterwards so it is installed inside
  the container.
- **Emails:** nothing is sent to real recipients. Every email is caught by
  [Mailpit](https://mailpit.axllent.org/) and can be read in the mailbox. It is
  emptied on every stop.
- **Rate limit:** login, signup and password reset share a limit of 100
  requests per hour. `docker compose restart api-gateway` resets it.

### Environment variables

These are the values that have to be filled in:

- **apiGateway** — `NODE_ENV` (`development` or `production`), `JWT_SECRET`,
  `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`
- **notificationService** — `MAIL_FROM_ADDRESS`, `EMAIL_USERNAME`,
  `EMAIL_PASSWORD` (the local mail catcher accepts any username and password,
  but they must not be empty)
- **userService**, **formService** — none

The remaining variables in the `config.env.example` files (`PORT`, `DATABASE`,
`DATABASE_PASSWORD`, `*_SERVICE_URL`, `EMAIL_HOST`, `EMAIL_PORT`) can be left
empty: `docker-compose.yml` sets the ones that are used and overrides
`config.env`.

## License

This project is licensed under the
[PolyForm Noncommercial License 1.0.0](./LICENSE).

You are free to use, modify, and share this software **for any noncommercial
purpose** — including research, study, and use by educational institutions.
**Commercial use is not permitted.** See the [LICENSE](./LICENSE) file for the
full terms.

Copyright © 2026 Athanasios Kalampoukas.
