# kysely-adapter-bun

## Installation

```bash
# with bun
bun add kysely kysely-adapter-bun

# with pnpm
pnpm add kysely kysely-adapter-bun

# with yarn
yarn add kysely kysely-adapter-bun

# with npm
npm install kysely kysely-adapter-bun
```

## Usage

You can pass a new instance of `PostgresDialect` as the `dialect` option when creating a new `Kysely` instance:

```typescript
import { Kysely } from 'kysely'
import { PostgresDialect } from 'kysely-adapter-bun'

const db = new Kysely<Database>('postgresql://[user[:password]@][netloc][:port][/dbname]')
```

## License

MIT License, see `LICENSE`.