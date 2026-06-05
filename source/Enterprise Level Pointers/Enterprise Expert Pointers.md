# Enterprise Expert React Native Pointers

## 1. Expert-Level Engineering Outcome

An expert-level React Native engineer should be able to independently design, build, test, release, monitor, and evolve production mobile applications used by real customers at scale.

They should be able to make platform decisions with evidence, protect user and business data, support compliant delivery, lead technical reviews, mentor other engineers, and keep the codebase maintainable across teams and release cycles.

## 2. Architecture Standards

- Use feature-first folder architecture.
- Keep business logic out of UI components.
- Keep API calls inside feature-level API modules or approved shared networking modules.
- Use shared modules only for genuinely reusable components, utilities, design tokens, telemetry, storage, and platform services.
- Define clear module boundaries and import rules.
- Use public exports for cross-feature access.
- Document major architecture decisions with ADRs or RFCs.
- Avoid unnecessary abstractions unless they reduce real complexity.
- Design modules for testability, ownership, and long-term maintainability.
- Support multi-team ownership through clear folder, package, and review boundaries.

## 3. React Native Expert Topics

- React Native New Architecture.
- Turbo Modules.
- Fabric renderer.
- JSI concepts.
- Hermes engine tuning and profiling.
- JS thread vs UI thread behavior.
- Native bridge limitations and migration strategy.
- Native module development in Swift, Objective-C, Kotlin, and Java.
- C++ modules for high-performance native use cases.
- Gesture Handler and Reanimated for native-driven interactions.
- Low-end Android device performance testing.
- React Native Web or multi-platform sharing where it is justified.

## 4. State And Data Management

- Use local state for view-only concerns.
- Use TanStack Query or equivalent for server state.
- Use Redux Toolkit, Zustand, or similar only when shared durable client state is justified.
- Use typed API request and response models.
- Handle loading, empty, success, and error states consistently.
- Support timeout, cancellation, retry, and normalized error handling.
- Track API failures with telemetry.
- Design offline-first flows when product requirements need them.
- Handle cache invalidation and sync conflicts explicitly.
- Avoid global state for temporary screen behavior.

## 5. Security, Privacy, And Compliance

- Follow OWASP MASVS principles for mobile security.
- Never commit secrets, private keys, provisioning profiles, keystores, or production tokens.
- Use secure storage for tokens and sensitive local data.
- Use TLS for all production traffic.
- Use certificate pinning only when the team can support certificate rotation and incident recovery.
- Classify data as public, internal, confidential, or regulated.
- Minimize collection of PII.
- Encrypt sensitive data where required.
- Avoid logging tokens, credentials, payment data, health data, and raw PII.
- Use purpose-bound permissions and request them only when needed.
- Provide usable permission-denied flows.
- Review analytics and crash reports for privacy leakage.
- Consider jailbreak/root detection for high-risk apps.
- Consider tamper detection and anti-debug policy for sensitive apps.

## 6. Quality Gates

- Use TypeScript strict mode.
- Avoid implicit `any`.
- Use ESLint and Prettier.
- Enforce import boundaries.
- Run dead-code and dependency checks where possible.
- Require code review before merging production code.
- Write unit tests for business logic.
- Write component tests for critical UI.
- Write integration tests for feature workflows.
- Use Detox or equivalent for release-critical E2E paths.
- Mock native modules properly in tests.
- Add regression tests for production bugs.
- Keep documentation updated for major modules.

## 7. Accessibility Standards

- Support screen readers.
- Add accessibility labels for interactive controls.
- Maintain logical focus order.
- Support dynamic font scaling.
- Meet color contrast requirements.
- Avoid touch targets that are too small.
- Provide accessible error messages.
- Test key flows with accessibility tools.
- Do not rely only on color to communicate important state.

## 8. Performance Standards

- Measure cold start and warm start time.
- Track p50 and p95 performance by device tier.
- Monitor render performance and frame drops.
- Use FlashList or equivalent for large lists.
- Optimize images with caching and correct sizing.
- Avoid unnecessary re-renders.
- Use memoization only where it has measurable value.
- Detect memory leaks.
- Track bundle size growth.
- Profile animations and navigation transitions.
- Test on low-end Android devices, not only simulators or flagship phones.

## 9. CI/CD And Release Governance

- Pipeline must run install, typecheck, lint, tests, and build validation.
- Add security and dependency scanning where applicable.
- Use separate configurations for development, staging, UAT, and production.
- Protect production signing assets.
- Produce reproducible Android AAB and iOS IPA artifacts.
- Use EAS Build, Fastlane, GitHub Actions, Bitrise, or equivalent.
- Define versioning and build-number rules.
- Generate release notes.
- Use staged rollouts.
- Use feature flags for risky releases.
- Define rollback procedures.
- Define OTA update policy.
- Monitor production after release.
- Assign a release owner for critical releases.

## 10. Observability And Operational Metrics

- Track crash-free sessions.
- Track app startup time.
- Track API error rate.
- Track API latency.
- Track frame drops.
- Track memory usage.
- Track bundle size.
- Track release adoption.
- Track rollback rate.
- Track support-ticket spikes after release.
- Use Sentry, Datadog, Firebase Crashlytics, or equivalent.
- Add logs with useful context but without sensitive data.
- Create alerts for sustained production failures.
- Create runbooks for incidents.

## 11. Design System And UI Governance

- Use approved design tokens.
- Use reusable accessible components.
- Maintain consistency across platforms.
- Support dark mode where required.
- Support responsive layouts.
- Keep component APIs stable.
- Version shared UI packages carefully.
- Review design system changes for cross-team impact.
- Avoid one-off UI patterns unless product requirements justify them.

## 12. Enterprise Collaboration

- Write clear RFCs for large technical changes.
- Record decisions with ADRs.
- Review code for correctness, maintainability, performance, accessibility, and security.
- Mentor junior and mid-level engineers.
- Define coding standards.
- Participate in incident reviews.
- Communicate technical trade-offs clearly.
- Balance speed, quality, risk, and maintainability.
- Coordinate cross-team dependencies.
- Own platform-level improvements.

## 13. Expert Evaluation Checklist

- Can design a scalable React Native architecture from scratch.
- Can improve an existing large React Native codebase without unnecessary rewrites.
- Can explain when to use Expo, bare React Native, or native modules.
- Can debug production crashes using logs and crash reports.
- Can profile and fix performance issues with evidence.
- Can build secure authentication and session handling.
- Can create CI/CD pipelines for Android and iOS.
- Can manage release rollouts and rollback plans.
- Can review code at architecture level.
- Can guide teams through New Architecture migration.
- Can make platform trade-off decisions between React Native, native, Flutter, and web.
- Can define quality gates for enterprise delivery.
- Can lead technical discussions with product, design, QA, DevOps, and security teams.

## 14. Final Expert Standard

An expert React Native engineer is not only someone who knows advanced APIs. They are someone who can own the full lifecycle of a mobile platform: architecture, delivery, security, quality, performance, release, observability, and team standards.
