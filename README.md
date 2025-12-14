# Attendance Tracking System

Simple attendance tracking system. Users will input their username to log their time-in and time-out attendance per day. Attendance records of all users and of a specific user can be seen. Shows daily summary on dashboard.

## Setup

The project is structured like so:

```
📦attendance-tracking-system
┣ 📂public // static assets not bundled
┃ ...
┣ 📂scripts
┃ ┣ create-db.ps1 // db creation script
┣ 📂server
┃ ┣ ...
┣ 📂src // frontend
┃ ┣ ...
┃ 📜... // root files, usually configs
```

### Frontend structure

```
┣ 📂src
┃ ┣ 📂app
┃ ┃ ┣ 📜index.tsx
┃ ┃ ┣ 📜provider.tsx
┃ ┃ ┗ 📜routes.tsx
┃ ┣ 📂assets
┃ ┃ ┗ 📜react.svg
┃ ┣ 📂components
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┣ 📜button.tsx
┃ ┃ ┃ ┣ 📜calendar.tsx
┃ ┃ ┃ ┣ 📜card.tsx
┃ ┃ ┃ ┣ 📜dropdown-menu.tsx
┃ ┃ ┃ ┣ 📜input.tsx
┃ ┃ ┃ ┣ 📜label.tsx
┃ ┃ ┃ ┣ 📜navigation-menu.tsx
┃ ┃ ┃ ┣ 📜popover.tsx
┃ ┃ ┃ ┣ 📜table.tsx
┃ ┃ ┃ ┗ 📜typography.tsx
┃ ┃ ┣ 📜app-header.tsx
┃ ┃ ┣ 📜date-picker.tsx
┃ ┃ ┣ 📜mode-toggle.tsx
┃ ┃ ┣ 📜pagination-buttons.tsx
┃ ┃ ┗ 📜theme-provider.tsx
┃ ┣ 📂hooks
┃ ┃ ┣ 📜use-api-fetch.tsx
┃ ┣ 📂layouts
┃ ┃ ┗ 📜default-layout.tsx
┃ ┣ 📂lib
┃ ┃ ┗ 📜utils.ts
┃ ┣ 📂pages
┃ ┃ ┣ 📂dashboard
┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┣ 📜card.tsx
┃ ┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┣ 📂home
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┣ 📂records
┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📂users
┃ ┃ ┃ ┗ 📂id
┃ ┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┃ ┗ 📜card.tsx
┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┣ 📜index.css
┃ ┗ 📜main.tsx
```

#### ./src/app

Contains the main application, providers and routes.

#### ./src/assets

Static files used by components, bundled on the build process.

#### ./src/components

Shared components usable by any feature/module/page.

#### ./src/layouts

Page layouts, used by routes.

#### ./src/libs

Shared functions usable by any feature/module/page, usually utils.

#### ./src/pages

The pages of the application. The directory structure maps to the route in the client. For example:

```
./src/pages/dashboard = /dashboard
./src/pages/home = /home
./src/pages/records = /records
```

Each directory such as `./src/pages/users` should have a structure of:

```
📂users // name of the page, is '/users'
┗ 📂id // optional, a subdirectory, the parameter like :id or :slug, example is '/users/1'
┃ ┣ 📂ui // page-specific components
┃ ┃ ┗ 📜card.tsx
┃ ┗ 📜page.tsx
┣ 📂ui // page-specific-components
┃ ┣ 📜card.tsx
┃ ┗ 📜table.tsx
┗ 📜page.tsx
```

### Backend structure

```
┣ 📂server
┃ ┣ 📂db
┃ ┃ ┣ 📜db.ts
┃ ┃ ┣ 📜seed.attendance-records.ts
┃ ┃ ┣ 📜seed.ts
┃ ┃ ┗ 📜seed.users.ts
┃ ┣ 📂lib
┃ ┃ ┗ 📜utils.ts
┃ ┣ 📂routes
┃ ┃ ┣ 📜attendance-records.ts
┃ ┃ ┣ 📜dashboard.ts
┃ ┃ ┣ 📜routes.ts
┃ ┃ ┗ 📜users.ts
┃ ┗ 📜index.ts
```

#### ./server/db

Contains files related to database.

#### ./server/lib

Contains shared functions usable anywhere in the backend.

#### ./server/routes

Contains the backend routes, usually representing the directory's structure as the route itself. For example:

```
./server/routes/attendance-records = /api/attendance-records
./server/routes/dashboard = /api/dashboard
./server/routes/users = /api/users
```

where each route can handle `GET`/`POST`/`PUT`/`PATCH`/`DELETE` requests.

## Installation

Clone the project by running:

```
git clone https://github.com/ijagamino/attendance-tracker.git
```

## How to run locally

Go to the folder where the project is installed:

```
cd /path/to/project/attendance-tracker
```

### Project dependencies

Install dependencies by running `npm i`.

```
npm i
```

### Backend setup

This project uses MySQL, so make sure that a MySQL service is running. If you are unsure if a MySQL service is running, try `mysql -u root` in your terminal.

```
mysql -u root
```

### Database creation

Next, create the database by running `npm run db:create`.

```
npm run db:create
```

This runs ./scripts/create-db.ps1 which contains

```
$DatabaseName = "attendance_tracking_system"

Write-Host "Creating database: $DatabaseName"

mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DatabaseName;"

Write-Host "Done!"
```

### Frontend & backend server

Run `npm run dev` to start frontend on http://localhost:5173

```
npm run dev
```

Then on another terminal, run `npm run server` to start the backend on http://localhost:3000

```
npm run server
```

## Components

### Time In/Time Out Buttons

The time in and time out buttons are buttons that submit form data from the attendance form which has a `username` input. This data is sent to the backend.

#### Purpose
The time in and time out buttons both send a request to the server.

The time in button sends a `POST` request to `/api/attendance-records`, which 


### Tables

### Pagination Buttons

### Dashboard Cards
