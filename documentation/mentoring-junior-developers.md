# Mentoring Junior Developers

This guide outlines the principles, tools, and processes for mentoring junior developers within our engineering team. Our goal is to cultivate a supportive learning environment while maintaining high code quality and fast onboarding.

---

## 1. Principles of Mentorship

Successful mentoring rests on three core pillars:
1. **Psychological Safety**: Create an environment where juniors feel comfortable asking questions, admitting mistakes, and proposing ideas without fear of negative judgment.
2. **Scaffolded Autonomy**: Provide strong guidance initially (e.g. structured pair programming), gradually removing support as they gain confidence and experience.
3. **Constructive Feedback Loops**: Provide specific, actionable, and timely feedback that focuses on patterns rather than one-off occurrences.

---

## 2. Onboarding Path (30-60-90 Day Plan)

A structured transition ensures juniors become contributors efficiently without feeling overwhelmed:

*   **Day 1 to 30 (Onboarding & Orientation)**:
    *   Set up local development environments using the monorepo workspace configurations.
    *   Deploy small bug fixes or minor updates to staging environments to learn deployment scripts.
    *   Focus on reading the existing documentation.
*   **Day 31 to 60 (Structured Collaboration)**:
    *   Conduct structured pair programming sessions.
    *   Deliver small-to-medium user features with moderate supervision.
    *   Actively participate in code review discussions.
*   **Day 61 to 90 (Autonomy & Growth)**:
    *   Take ownership of full feature cycles (design, implement, test).
    *   Initiate or author technical proposals using the RFC guidelines.

---

## 3. Pair Programming Guidelines

Pair programming is the fastest way to transfer code context. We recommend two primary patterns:

### Driver-Navigator Pattern
*   **The Driver**: Focuses on writing typecheck-clean code, implementing the immediate lines of logic.
*   **The Navigator**: Focuses on the bigger picture, analyzing edge cases, structural architecture, and reviewing guidelines (e.g., verifying `const` usage over `let`).
*   **Rotation**: Rotate roles every 30 to 45 minutes to keep both developers engaged.

### Ping-Pong Pattern (TDD focus)
*   Developer A writes a failing unit test.
*   Developer B writes the minimal implementation to make the test pass.
*   Developer B writes the next failing unit test, and Developer A implements it.

---

## 4. Career & Growth Framework

Support juniors in expanding their skills systematically:
*   **Weekly 1-on-1s**: Discuss blockers, clarify career objectives, and review growth areas.
*   **Training & Tech Talks**: Share knowledge regarding native platform code (CocoaPods/Swift integration, Gradle properties) and React Native architectures (Hermes engine profiling, Turbo modules).
*   **Aligning Standards**: Help them master our code style (exported interfaces instead of type aliases for object shapes, immutable constants).

```typescript
// Example training exercise: Convert bad style to team guidelines

// BAD STYLE: Use of let, and type alias for object shape
type Employee = {
  id: number;
  role: string;
};
let defaultRole = "Developer";

// RECOMMENDED STYLE: Use of const, and exported interface shape
export interface Employee {
  id: number;
  role: string;
}
const DEFAULT_ROLE = "Developer";
```
