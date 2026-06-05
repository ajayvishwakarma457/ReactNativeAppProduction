# Coding Standards & Linting Rules

This document outlines the linting rules, formatting guidelines, and TypeScript configurations utilized in this React Native monorepo workspace to guarantee a high quality and standard style.

---

## 1. ESLint Configuration

Our configuration is located at `.eslintrc.js` at the workspace root. We extend the default `@react-native` standard layout guidelines.

### Primary Linting Checks
1. **Unused Variables**: Checked using `no-unused-vars` rules to avoid garbage memory declarations.
2. **React Hooks Rules**: Enforces exhaustive hook dependency arrays and prevents call conditionals.
3. **No Console Logs in Production**: Prevents committing verbose logs into production bundles (we use build plugins to strip these).

---

## 2. Prettier Formatting Config

Our formatting styles are declared inside `.prettierrc.js`:
*   `arrowParens: 'avoid'`: Single argument arrow functions omit parentheses, e.g. `x => x * 2`.
*   `singleQuote: true`: Prefers single quotes for string parameters.
*   `trailingComma: 'all'`: Appends trailing commas where possible (multi-line objects, arrays, parameter lists) for cleaner git diff blocks.

### Code Formatting Workflow
Format all workspace directories:
```bash
npx prettier --write "apps/**/*.{js,jsx,ts,tsx}" "libs/**/*.{js,jsx,ts,tsx}"
```

---

## 3. TypeScript Rules

All projects extend standard TypeScript rules. Main compilers configurations are defined inside the root `tsconfig.base.json`:
*   `strict: true`: Enables comprehensive type-checking.
*   `noImplicitAny: true`: Errors on variables resolving implicitly to `any`.
*   `strictNullChecks: true`: Prevents runtime null pointer dereferences.

### Coding Patterns Checklist (Enforced by Ajay)
*   **Prefer Constants (`const`)**: Always default to `const` declarations. Use `let` only when variable reassignment is strictly required.
*   **Prefer Exported Interfaces**: Object types must always be shaped using `interface` declarations and exported directly.

```typescript
// 1. Const preference
const total = 50; // Recommended
let currentCount = 0; // Only use let if value changes later

// 2. Interface preference
export interface ProductItem {
  id: string;
  price: number;
}
```
