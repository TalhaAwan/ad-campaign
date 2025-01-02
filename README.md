# Ad Campaign

This project contains nest application that maintains, serves and records ad campaigns of the brands.

## Prerequisite

- node >= v20.15.0
- npm >= 10.7.0
- postgress database - ensure there's a database by the ename of `ad`

## Initialize & run the project

- clone the repository and change directory to `ad-campaign`
- add `.env` file in the root and add the required variables:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=ad
DB_PASS=12345678
DB_PORT=5432
```
- `npm i`
- `npm run migrate:latest` (runs the knex migrations to add tables)
- `npm run seed:run` (seeds initial data for testing)
- `npm run start:dev` (starts the project at port 3000)
- access the APIs through postman collection shared separately
