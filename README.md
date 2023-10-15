# User Directory Search

A React/Vite directory that loads users from an API, supports list/grid presentation and filtering, and presents detailed personal and company information.

```text
UserService -> Redux user state -> search/filter utilities -> list, grid, and detail views
```

## Local setup

```bash
npm install
npm run dev
npm test
```

`UserService` isolates remote access, `UserFilters` contains deterministic filtering, and custom hooks coordinate list/detail loading. Vitest coverage exists for services and filters.

The public API contract, pagination, stale-request handling, caching, and accessibility need integration verification. Error messages are user-facing but do not establish retry/offline behavior.
