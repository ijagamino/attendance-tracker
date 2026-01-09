# Attendance Tracking System

<!--toc:start-->

- [Attendance Tracking System](#attendance-tracking-system)
  - [Setup](#setup)
    - [Frontend structure](#frontend-structure)
  - [Installation](#installation)
  - [How to run locally](#how-to-run-locally)
    - [Project dependencies](#project-dependencies)
    - [Backend setup](#backend-setup)
      - [Database seeding](#database-seeding)
    - [Frontend](#frontend)
  - [Components](#components)
    - [Time In/Time Out Buttons](#time-intime-out-buttons)
      - [Props](#props)
      - [Purpose](#purpose)
      - [Behavior](#behavior)
    - [Data Table](#data-table)
      - [Props](#props-1)
        - [Columns](#columns)
      - [Purpose](#purpose-1)
      - [Behavior](#behavior-1)
    - [Pagination Buttons](#pagination-buttons)
      - [Props](#props-2)
      - [Purpose](#purpose-2)
      - [Behavior](#behavior-2)
  - [Hooks](#hooks)
    - [useQueryParam](#usequeryparam)
      - [Props](#props-3)
      - [Purpose](#purpose-3)
      - [Behavior](#behavior-3)
      <!--toc:end-->

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
┣ 📂supabase // local backend setup
┃ ┣ ...
┗ 📜... // root files, usually configs
```

### Frontend structure

```plaintext
📂src
┣ 📂app
┃ ┣ 📂providers
┃ ┃ ┗ 📜... // application providers
┃ ┣ 📜index.tsx
┃ ┣ 📜provider.tsx
┃ ┗ 📜router.tsx
┣ 📂assets
┃ ┗ 📜... // application assets
┣ 📂components
┃ ┣ 📂ui
┃ ┃ ┗ 📜... // shadcn primitive components
┃ ┣ 📜... // reusable components
┣ 📂hooks
┃ ┣ 📜... // reusable hooks
┣ 📂layouts
┃ ┗ 📜... // page layouts
┣ 📂lib
┃ ┣ 📂foo
┃ ┃ ┗ 📜bar.ts
┃ ┗ 📜... // reusable code
┣ 📂pages
┃ ┣ 📂foo
┃ ┃ ┣ 📂bar
┃ ┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┃ ┗ 📜... // page-specific-components
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┣ 📂ui
┃ ┃ ┃ ┣ 📜... // page-specific-components
┃ ┗ ┗ 📜page.tsx
┣ 📂shared
┃ ┗ 📜... // shared types
┣ 📂supabase
┃ ┗ 📜... // supabase code
┣ 📜index.css
┗ 📜main.tsx
```

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

Docker is required.

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

Run `vercel env pull` to pull local env variables then `vercel dev` to start
local development on <http://localhost:3000>

```sh
vercel env pull
vercel dev
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

export function DataTable<T extends Record<string, string | number | null>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
}) {
  ...
}
```

#### Props

| Name       | Required? | Type        | Notes                                            |
| ---------- | --------- | ----------- | ------------------------------------------------ |
| columns    | Yes       | Column<T>[] | The columns of the table                         |
| rows       | Yes       | T[]         | The rows of the teable                           |
| onRowClick | Yes       | function    | Callback function executed when a row is clicked |

##### Columns

```typescript
export interface Column {
  label: string
  value?: string
  format?: (value: unknown, row: T) => ReactNode
}
```

Columns without a key of `value` automatically derives the
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

#### Purpose

Reusable table for displaying row data fetched from backend.

#### Behavior

Has table header that represents columns and table body that shows data.
Inside the component is a column formatter function that derives the `value` key
of a column based on its `label` if no `value` is set.

### Pagination Buttons

```typescript
./src/components/pagination-buttons.tsx

export default function PaginationButtons({
  page,
  totalPage?,
  onPageChange,
}: {
  page: number
  totalPage?: number
  onPageChange: (newPage: number) => void
}) {
  ...
}
```

#### Props

| Name         | Required? | Type     | Notes                                                             |
| ------------ | --------- | -------- | ----------------------------------------------------------------- |
| page         | Required  | number   | The current page                                                  |
| totalPage    | Optional  | number   | Total page                                                        |
| onPageChange | Required  | function | Callback function called whenever any of the two buttons are used |

#### Purpose

Reusable pagination buttons for use with paginated datasets.

Used with `data-table` if `data-table` receives a paginated data.

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

```typescript
./src/hooks/use-query-param.ts

export default function useQueryParam(initialState: Record<string, string>) {
  ...
}
```

#### Props

| Name         | Required? | Type                   | Notes                             |
| ------------ | --------- | ---------------------- | --------------------------------- |
| initialState | Yes       | Record<string, string> | Initial state of query parameters |

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
