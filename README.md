# Attendance Tracking System

Simple attendance tracking system. Users will input their username to log their
time-in and time-out attendance per day. Attendance records of all users and of
a specific user can be seen. Shows daily summary on dashboard.

---

## Setup

The project is structured like so:

```plaintext
📦attendance-tracking-system
┣ 📂public // static assets not bundled
┃ ...
┣ 📂src // frontend
┃ ┣ ...
┃ 📜... // root files, usually configs
```

### Frontend structure

```plaintext
📂src
┣ 📂app
┃ ┣ 📂providers
┃ ┃ ┣ 📜auth-provider.tsx
┃ ┃ ┗ 📜theme-provider.tsx
┃ ┣ 📜index.tsx
┃ ┣ 📜provider.tsx
┃ ┗ 📜router.tsx
┣ 📂assets
┃ ┗ 📜react.svg
┣ 📂components
┃ ┣ 📂ui
┃ ┃ ┣ 📜button.tsx
┃ ┃ ┣ 📜calendar.tsx
┃ ┃ ┣ 📜card.tsx
┃ ┃ ┣ 📜dropdown-menu.tsx
┃ ┃ ┣ 📜input-group.tsx
┃ ┃ ┣ 📜input.tsx
┃ ┃ ┣ 📜label.tsx
┃ ┃ ┣ 📜navigation-menu.tsx
┃ ┃ ┣ 📜popover.tsx
┃ ┃ ┣ 📜separator.tsx
┃ ┃ ┣ 📜sonner.tsx
┃ ┃ ┣ 📜table.tsx
┃ ┃ ┣ 📜textarea.tsx
┃ ┃ ┗ 📜typography.tsx
┃ ┣ 📜app-header.tsx
┃ ┣ 📜date-table.tsx
┃ ┣ 📜date-picker.tsx
┃ ┣ 📜login-route-wrapper.tsx
┃ ┣ 📜mode-toggle.tsx
┃ ┣ 📜pagination-buttons.tsx
┃ ┗ 📜protect-route.tsx
┣ 📂hooks
┃ ┣ 📜use-query-param.tsx
┣ 📂layouts
┃ ┣ 📜default-layout.tsx
┃ ┗ 📜login-layout.tsx
┣ 📂lib
┃ ┣ 📂error
┃ ┃ ┗ 📜error-handler.ts
┃ ┣ 📜format.ts
┃ ┗ 📜utils.ts
┣ 📂pages
┃ ┣ 📂dashboard
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┣ 📜card.tsx
┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂home
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂not-found
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂records
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┗ 📜table.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂users
┃ ┃ ┃ ┣ 📂id
┃ ┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┃ ┣ 📜card.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜table.tsx
┃ ┗ ┗ ┗ ┗ 📜page.tsx
┣ 📂shared
┃ ┗ 📜types.ts
┣ 📂supabase
┃ ┣ 📜auth.ts
┃ ┣ 📜client.ts
┃ ┣ 📜database.types.ts
┃ ┗ 📜global.types.ts
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

The pages of the application. The directory structure maps to the route in the
client. For example:

```plaintext
./src/pages/dashboard = /dashboard
./src/pages/home = /home
./src/pages/records = /records
./src/pages/users = /users
./src/pages/users/id/ = /users/[:id]
```

Each directory such as `./src/pages/users` should have a structure of:

```plaintext
📂users
┣ 📂id // optional subdirectory, the parameter like :id or :slug,
example is '/users/1'
┃ ┣ 📂ui // page-specific components
┃ ┃ ┗ 📜card.tsx
┃ ┗ 📜page.tsx
┣ 📂ui // page-specific-components
┃ ┣ 📜card.tsx
┃ ┗ 📜table.tsx
┗ 📜page.tsx
```

#### ./src/shared

Contains files usable by anywhere in the frontend.

#### ./src/supabase

The supabase client, also contains types.

---

## Installation

Clone the project by running:

```sh
git clone https://github.com/ijagamino/attendance-tracker.git
```

## How to run locally

Go to the folder where the project is installed:

```sh
cd /path/to/project/attendance-tracker
```

### Project dependencies

Install dependencies by running `npm i`.

```sh
npm i
```

### Backend setup

This project uses supabase (PostgreSQL). To learn how supabase is used for
local development, check out [supabase for local development](https://supabase.com/docs/guides/local-development).

Docker is required for supabase local development.

To start the server, run:

```sh
npx supabase start
```

#### Database seeding

Run `npx supabase db migration up` then seed the database by running `npm run db:seed`.

```sh
npx supabase db migration up
npm run db:seed
```

### Frontend

Run `npm run dev` to start local development on <http://localhost:5173>

```sh
npm run dev
```

---

## Components

### Time In/Time Out Buttons

#### Props

None

#### Purpose

The time in and time out buttons are buttons that records an authenticated
user's attendance.

#### Behavior

The time in button sends a `POST` request to `/api/attendance-records`.

The time out button sends a `PATCH` request to `/api/attendance-records`.

### Data Table

```typescript
// ./src/components/data-table.tsx

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

##### Columns

```typescript
export interface Column {
  label: string
  value?: string
  format?: (value: unknown, row: T) => ReactNode
}
```

Columns without a key of `value` (as it is optional) automatically derives the
value of key `value` by camelCasing the label.

```typescript
label: 'Time In'
```

is computed as:

```typescript
label: 'Time In'
value: 'timeIn'
```

once passed to the component.

`format` can also be optionally passed to format the value of the column,
like so:

```typescript
{
  label: 'Total Hours',
  format: (_, row) => {
    return formatInterval(row.total_hours as string)
  },
},
```

##### Rows

`rows` **required** `<T extends Entity>`

The data to be displayed in the table body.

It must extend the entity interface, as defined in `T extends Entity` found in `./shared/types/api.ts`

##### OnRowClick

`onRowClick` _optional_ `(row: T) => {}`

A callback function that is executed when a row is clicked, `row` can be passed
as an argument.

#### Purpose

Reusable table for displaying row data fetched from backend.

#### Behavior

Has table header that represents columns and table body that shows data.
Inside the component is a column formatter function that derives the `value` key
of a column based on its `label` if no `value` is set.

### Pagination Buttons

`./src/components/pagination-buttons.tsx`

#### Props

```typescript
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

A callback function that is called whenever any of the two buttons are used.
`newPage` is passed as an argument.

#### Purpose

Reusable pagination buttons used with tables.

Used with `data-table` if `data-table` receive a paginated data.

#### Behavior

```typescript
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

```typescript
export default function useQueryParam(initialState: Record<string, string>)
{ ... }
```

#### Props

##### initialState

`initialState` **required** `Record<string, string>`

The initial state of the query parameters.

#### Purpose

Custom defined hook to handle query parameter change in the URL.

#### Behavior

Uses react-router's `useSearchParams`. Exposes a `setParam` function that
respects the previous query parameters and adds (if not existing) or sets
(if existing) the query parameter to the URL.

For example:

`/url?page=1`

`setParam('page', '5')` turns into `/url?page=5`

then

`setParam('username', 'foo')` turns into `/url?page=5&username=foo`
