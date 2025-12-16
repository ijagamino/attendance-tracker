# Attendance Tracking System

Simple attendance tracking system. Users will input their username to log their time-in and time-out attendance per day. Attendance records of all users and of a specific user can be seen. Shows daily summary on dashboard.

---

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
📂src
┣ 📂app
┃ ┣ 📜index.tsx
┃ ┣ 📜provider.tsx
┃ ┗ 📜routes.tsx
┣ 📂assets
┃ ┗ 📜react.svg
┣ 📂components
┃ ┣ 📂ui
┃ ┃ ┣ 📜button.tsx
┃ ┃ ┣ 📜calendar.tsx
┃ ┃ ┣ 📜card.tsx
┃ ┃ ┣ 📜dropdown-menu.tsx
┃ ┃ ┣ 📜input.tsx
┃ ┃ ┣ 📜label.tsx
┃ ┃ ┣ 📜navigation-menu.tsx
┃ ┃ ┣ 📜popover.tsx
┃ ┃ ┣ 📜table.tsx
┃ ┃ ┗ 📜typography.tsx
┃ ┣ 📜app-header.tsx
┃ ┣ 📜date-picker.tsx
┃ ┣ 📜mode-toggle.tsx
┃ ┣ 📜pagination-buttons.tsx
┃ ┗ 📜theme-provider.tsx
┣ 📂hooks
┃ ┣ 📜use-api-fetch.tsx
┣ 📂layouts
┃ ┗ 📜default-layout.tsx
┣ 📂lib
┃ ┗ 📜utils.ts
┣ 📂pages
┃ ┣ 📂dashboard
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┣ 📜card.tsx
┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂home
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂records
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┗ 📂users
┃ ┃ ┃ ┗ 📂id
┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┗ 📜card.tsx
┃ ┃ ┃ ┗ 📜page.tsx
┣ 📜index.css
┗ 📜main.tsx
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
┣ 📂id // optional, a subdirectory, the parameter like :id or :slug, example is '/users/1'
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
📂server
┣ 📂db
┃ ┣ 📜db.ts
┃ ┣ 📜seed.attendance-records.ts
┃ ┣ 📜seed.ts
┃ ┗ 📜seed.users.ts
┣ 📂lib
┃ ┗ 📜utils.ts
┣ 📂routes
┃ ┣ 📜attendance-records.ts
┃ ┣ 📜dashboard.ts
┃ ┣ 📜routes.ts
┃ ┗ 📜users.ts
┗ 📜index.ts
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

---

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

---

## Components

### Time In/Time Out Buttons

#### Props used

None

#### Purpose

The time in and time out buttons are buttons that records an authenticated user's attendance.

#### Behavior

The time in button sends a `POST` request to `/api/attendance-records`.

The time out button sends a `PATCH` request to `/api/attendance-records`.

### Data Table

`./src/components/data-table.tsx`

```
export function DataTable<T extends Entity>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column[]
  rows: T[]
  onRowClick?: (row: T) => void
}) { ... }
```

#### Props

###### Columns

`columns`**required** `{label: string, value?: string}[]`

Uses Column interface:

```
export interface Column {
  label: string
  value?: string
}
```

Columns without a key of `value` (as it is optional) automatically derives the value of key `value` by camelCasing the label.

```
label: 'Time In'
```

is computed as:

```a
label: 'Time In'
value: 'timeIn'
```

once passed to the component.

##### Rows

`rows` **required** `<T extends Entity>`

The data to be displayed in the table body.

It must extend the entity interface, as defined in `T extends Entity` found in `./shared/types/api.ts`

##### OnRowClick

`onRowClick` _optional_ `(row: T) => {}`

A callback function that is executed when a row is clicked, `row` can be passed as an argument.

#### Purpose

Reusable table for displaying row data fetched from backend.

#### Behavior

Has table header that represents columns and table body that shows data.
Inside the component is a column formatter function that derives the `value` key of a column based on its `label` if no `value` is set.

### Pagination Buttons

`./src/components/pagination-buttons.tsx`

#### Props

```
export default function PaginationButtons({
  page,
  totalPage?,
  onPageChange,
}: {
  page: number
  totalPage?: number
  onPageChange: (newPage: number) => void
}) { ... }
```

##### Page

`page` **required** `number`

The current page, fetches data based on current page.

##### TotalPage

`totalPage` _optional_ `number`

The total page, shows how many pages are based on data fetched.

##### OnPageChange

`onPageChange` **required** `(newPage: number) => void`

A callback function that is called whenever any of the two buttons are used. `newPage` is passed as an argument.

#### Purpose

Reusable pagination buttons used with tables.

Used with `data-table` if `data-table` receive a paginated data.

#### Behavior

```
function handlePrevious() {
  if (page > 1) onPageChange(page - 1)
}

function handleNext() {
  if (totalPage !== undefined && page < totalPage) onPageChange(page + 1)
}
```

The component has two buttons.

The first button changes current page to previous page.

The second button changes current page to next page.

## Hooks

### useQueryParam

`./src/hooks/use-query-param.ts`

```
export default function useQueryParam(initialState: Record<string, string>) { ... }
```

#### Props

##### initialState 

`initialState` **required** `Record<string, string>`

The initial state of the query parameters.

#### Purpose

Custom defined hook to handle query parameter change in the URL.

#### Behavior

Uses react-router's `useSearchParams`. Exposes a `setParam` function that respects the previous query parameters and adds (if not existing) or sets (if existing) the query parameter to the URL.

For example:

`/url?page=1`

`setParam('page', '5')` turns into `/url?page=5`

then

`setParam('username', 'foo')` turns into `/url?page=5&username=foo`

### useApiFetch

`./src/hooks/use-api-fetch.ts`

```
export default function useApiFetch() {
  ...
  return useCallback(
    async function apiFetch<T>(
      url: RequestInfo | URL,
      method: HttpMethod,
      options?: RequestInit & {
        searchParams?: URLSearchParams
      },
      retry: boolean = true
    ): Promise<T> { ... }
  , [...])
}

```

#### Props

##### URL

`url` **required** `RequestInfo | URL`

The URL to make a fetch request to.

##### Method

`method` **required** `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`

The request method to be used.

##### Options

`options` _optional_ `RequestInit & { searchParams?: URLSearchParams }`

Options to be passed to the fetch API.

##### Retry

`retry` _required_ `boolean`

Determines whether requests should make a retry attempt.
