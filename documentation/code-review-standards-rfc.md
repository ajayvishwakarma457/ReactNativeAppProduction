# Code Review Standards & Engineering RFCs

This document defines the code quality bar, PR review workflows, and the Request for Comments (RFC) process for our React Native monorepo workspace.

---

## 1. Code Review Standards

Every pull request (PR) submitted to this repository must be reviewed and approved by at least one engineer before merging. Our primary goal is to ensure high code quality, consistency, and shared knowledge.

### Pre-PR Checklist for Authors
Before requesting a review, ensure that:
1. **Local Validation Passes**: Run the compiler type checks and test suites locally:
   ```bash
   npx nx run-many --target=typecheck
   npx nx run-many --target=test
   ```
2. **Formatting and Linting**: Run ESLint and Prettier checks to avoid styling discrepancies.
3. **No Placeholders**: Never merge TODOs without associated issue IDs in a ticketing system.

### Coding Preferences & Standards
We enforce the following conventions (established with team leadership):
* **Prefer Exported Interfaces Over Type Aliases**: For all object shapes, always use `interface` and export it directly.
  ```typescript
  // GOOD: Exported interface for object shape
  export interface UserProfile {
    id: string;
    displayName: string;
    email: string;
  }

  // BAD: Type alias for object shape
  type UserProfile = {
    id: string;
    displayName: string;
    email: string;
  };
  ```
* **Prefer `const` Over `let`**: Declare variables with `const` unless reassignment is absolutely necessary.
  ```typescript
  // GOOD: Const declarations
  const value = 42;
  const items = [1, 2, 3];

  // BAD: Unnecessary let declarations
  let value = 42;
  ```

### Reviewer Guidelines
* **Be Constructive & Kind**: Focus reviews on the code, not the author. Explain *why* a change is recommended.
* **Categorize Comments**: Use prefixes to distinguish severity:
  * `[BLOCKING]`: Critical issues that must be addressed (e.g. security flaws, type errors, memory leaks).
  * `[SUGGESTION]`: Minor styling/readability improvements (non-blocking).
  * `[QUESTION]`: Inquiries for clarity (non-blocking).
* **Verify Architecture Constraints**: Check that native modular boundaries are respected (e.g., app-level modules vs shared library exports).

---

## 2. Engineering RFCs (Request for Comments)

For any non-trivial design decision, major architectural change, or introduction of new core libraries, developers must write an engineering RFC before starting the implementation.

### When is an RFC Required?
* Adding a new native library or upgrading a critical SDK package.
* Major folder structure modifications or new architectural patterns (e.g., migrating to C++ JSI / Turbo Modules).
* Core state management shifts or database/caching migrations.

### RFC Template Structure
All RFCs should be created in the `documentation/rfcs/` folder using the following format:

1. **Title & Status**: Brief description of the proposal and current status (`Draft`, `Under Review`, `Approved`, `Obsolete`).
2. **Author**: Who is proposing the change.
3. **Problem Statement**: What problem is this solving? Why is it necessary?
4. **Proposed Architecture**: Detailed technical design with diagrams if applicable.
5. **Alternative Solutions Considered**: Other ideas explored and why they were rejected.
6. **Backward Compatibility & Risks**: How will this affect existing platforms (iOS/Android/Web) or user data?
7. **Verification Plan**: Detailed steps, automated, and manual tests to verify correctness.

### RFC Review Process
1. **Submit Draft**: Create the RFC draft as a PR to `documentation/rfcs/rfc-xxxx-name.md`.
2. **Review & Discussion**: Keep the discussion open for at least 3 business days for team feedback.
3. **Alignment**: Address comments and reach team alignment.
4. **Approve & Merge**: Once approved, merge the RFC into the `main` branch. The implementation phase can then begin.
