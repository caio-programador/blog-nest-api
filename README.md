## Description

This project is a REST API for a blog built with [NestJS](https://github.com/nestjs/nest) and uses JWT for authentication. The application leverages PostgreSQL running in a Docker container for the database and utilizes the TypeORM framework for Object-Relational Mapping (ORM).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Using the Project

To use this project, you should create a `docker-compose.yaml` file that includes two database services: one for testing and one for the main database. However, you are free to use another database if you prefer; you will just need to adjust some configurations in the project.

There is also a `.env.example` file provided. You should use this file as a template to configure your own environment variables.

Additionally, the project includes a `API BLOG.postman_collection.json` file, which contains all the routes needed to use the application.

You can access the API documentation at `http://localhost:3000/docs`.

The project uses migrations to handle the creation of tables and foreign keys. Therefore, you should run the following command to apply the migrations to the database:

```bash
# apply the migrations
$ npx typeorm migration:run -d dist/src/database/orm.migrations.config.js
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
