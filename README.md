# Zenstack Policy

## Installation

- Clone the project

  ```bash
  # using https
  git clone https://github.com/sagspot/zen-policy.git

  # or using ssh
  git clone git@github.com:sagspot/zen-policy.git

  # or using github cli
  gh repo clone sagspot/zen-policy
  ```

- Install packages

  ```bash
  yarn
  ```

- If you have docker, run the compose file to setup postgres. Otherwise use any database

  ```bash
  docker-compose up -d
  ```

- Sync and seed your database

  ```bash
  npx prisma db push && npx prisma db seed
  ```

- Start your dev server

  ```bash
  yarn dev
  ```

- Use postman or any other api testing tool to run requests

  ```bash
  http://localhost:5000
  ```

### Note

- The env file assumes that you have docker installed. If not, make sure to change the db url.
- The project contains the following endpoints

  ```bash
  @ GET: Retrieve all users
  GET /api/users

   @ PATCH: Update user details
  PATCH /api/users

  ```

- Add the following to the headers to mock auth

  ```bash
  x-user-id: number
  ```
