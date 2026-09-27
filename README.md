# rate-limiter

TypeScript, ESM, Node's built-in test runner. Source runs directly via Node's
type stripping (no bundler, no ts-node); `tsc` is used for type checking and for
emitting `dist/`.

## Setup

```bash
npm install
```

## Run

```bash
npm start        # run once
npm run dev      # watch mode
npm test         # node:test runner
npm run typecheck  # tsc --noEmit
npm run build      # emit dist/
```

Requires Node >= 22.6.
