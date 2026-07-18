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

## Setup

Requires [Node.js](https://nodejs.org/) and a MongoDB database.

Each service reads its configuration from a `config.env` file, which is **not**
committed to the repository (it holds secrets). Every service ships a
`config.env.example` listing the required variables — copy it and fill in your
own values:

```bash
# for each service that has one:
cp apiGateway/config.env.example          apiGateway/config.env
cp userService/config.env.example         userService/config.env
cp formService/config.env.example         formService/config.env
cp notificationService/config.env.example notificationService/config.env
```

Then install dependencies and start each component:

```bash
# in each service directory (apiGateway, userService, formService, notificationService)
npm install
npm start        # or: npm run watch   (auto-reload via nodemon)

# frontend
cd frontend
npm install
npm run watch    # dev server (or: npm run build)
```

Some services provide a seeder to populate the database:

```bash
npm run seed     # available in userService and formService
```

### Environment variables

Fill these into each service's `config.env` (see the matching
`config.env.example`):

- **apiGateway** — `NODE_ENV`, `PORT`, `USER_SERVICE_URL`, `FORM_SERVICE_URL`,
  `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`
- **userService** — `NODE_ENV`, `PORT`, `DATABASE`, `DATABASE_PASSWORD`
- **formService** — `NODE_ENV`, `PORT`, `DATABASE`, `DATABASE_PASSWORD`,
  `USER_SERVICE_URL`
- **notificationService** — `NODE_ENV`, `PORT`, `DATABASE`, `DATABASE_PASSWORD`,
  `USER_SERVICE_URL`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_HOST`,
  `EMAIL_PORT`, `MAIL_FROM_ADDRESS`

## License

This project is licensed under the
[PolyForm Noncommercial License 1.0.0](./LICENSE).

You are free to use, modify, and share this software **for any noncommercial
purpose** — including research, study, and use by educational institutions.
**Commercial use is not permitted.** See the [LICENSE](./LICENSE) file for the
full terms.

Copyright © 2026 Athanasios Kalampoukas.
