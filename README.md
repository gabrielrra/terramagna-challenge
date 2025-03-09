# TerraMagna Challenge

This repository contains a full-stack application for managing and visualizing farm data. The project is structured as a monorepo with separate frontend and backend applications.

## Project Structure

- `apps/frontend`: Angular application for the user interface
- `apps/backend`: Node.js/Express API backend

## Running the Project

You will need to create a `.env` file in the `backend` project root with the following variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=terramagna_db
```

### Using Docker (Recommended)

#### Prerequisites

- Docker
- Docker Compose

#### Steps

1. Build and start the containers:

   ```bash
   docker compose up -d
   ```

2. Access the application at `http://localhost:4200`

### Running Locally

#### Prerequisites

- Node.js (v22 or higher)
- npm
- PostgreSQL database

#### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   - Install and start PostgreSQL
   - Create a database named `terramagna_db`

3. Start the database server if it's not running

4. Run the backend (in one terminal):

   ```bash
   npm run dev -w=apps/backend
   ```

5. Run the frontend (in another terminal):

   ```bash
   npm run dev -w=apps/frontend
   ```

6. Access the application at `http://localhost:4200`

## **[IMPORTANT]** Initial data and Login

The application requires initial data to be present in the database. You can run the following command to seed the database with some initial data (API and database must be running):

```bash
curl -X POST http://localhost:3000/generate-fake-data -H "Content-Type: application/json" -d '{"quantity": 10}'
```

To login, use any username on `clients` table and the password `123456`.
Fetch an username using the following command (database must be running):

```bash
docker exec postgres_db psql -U postgres -d terramagna_db -c "SELECT username FROM clients LIMIT 1;"
```
