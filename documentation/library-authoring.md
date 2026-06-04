# SDK & Library Authoring Guide

This guide details the implementation, compiling pipeline, and release lifecycle workflows of internal and public npm packages in this workspace.

---

## 1. Library Structure (`libs/core-sdk`)

The SDK codebase resides in `libs/core-sdk` and exposes structured logging and API-client modules:

```
libs/core-sdk/
├── src/
│   ├── index.ts      # Exports entrypoint
│   ├── client.ts     # Core API Client SDK
│   └── logger.ts     # Premium logging system
├── tsconfig.json     # SDK TS compiler configurations
└── package.json      # SDK dependency and target configs
```

---

## 2. Compilation and Packaging Configuration

We transpile TypeScript code to standard ECMAScript Modules (ESM), CommonJS (CJS), and declaration types (`.d.ts`) using **`tsup`** (powered by `esbuild`).

### Target Mappings in `package.json`
To allow proper package resolution under modern bundlers (webpack, vite, metro, node), the exports fields are configured as follows:

```json
{
  "name": "@app/core-sdk",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    }
  }
}
```

---

## 3. How to Build the SDK Package

### Development Compilation
To build the library:
```bash
# Compile once
npm run build -w libs/core-sdk

# Run in watch mode for development
npm run watch -w libs/core-sdk
```

---

## 4. Publishing Pipeline

To publish the authored SDK internally or to public registries (e.g. npmjs.com), execute:

1. **Authentication**:
   ```bash
   npm login --registry=https://registry.npmjs.org
   ```
2. **Dry-Run Check (Validate Files)**:
   ```bash
   npm publish --dry-run -w libs/core-sdk
   ```
3. **Registry Release**:
   ```bash
   npm publish --access public -w libs/core-sdk
   ```
