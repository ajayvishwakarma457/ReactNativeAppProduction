# Performance Budgets & Monitoring (Sentry, Datadog)

This document defines our production application's performance budget limits, telemetry thresholds, and tracking mechanisms using Sentry and Datadog SDK integrations.

---

## 1. Application Performance Budgets

To preserve a premium user experience, the application must stay within strict performance limits across target iOS and Android devices:

| Metric | Target budget | Critical threshold | Description |
| :--- | :--- | :--- | :--- |
| **UI Thread FPS** | `> 58 FPS` | `< 50 FPS` | Main thread rendering frames. |
| **JS Thread FPS** | `> 55 FPS` | `< 45 FPS` | JavaScript engine work loop execution speed. |
| **App Startup Time** | `< 2.0s` | `> 3.5s` | Time from user icon tap to the first interactive screen. |
| **JS Heap Size** | `< 40 MB` | `> 80 MB` | Dynamic memory consumed by Hermes engine. |
| **Bundle Size (Release)**| `< 8 MB` | `> 12 MB` | Cleaned and compressed release OTA JS bundle asset size. |

---

## 2. Telemetry Tool Setup

We integrate Sentry for real-time error tracking and crash reporting, alongside Datadog for Real User Monitoring (RUM) and network analytics.

### Sentry Error Tracking Setup
Sentry captures unhandled promise rejections, JavaScript execution errors, and native C++/ObjC/Java crashes.

```typescript
import * as Sentry from '@sentry/react-native';

// Sentry initialization interface config (Enforced interface standard)
export interface SentrySetupConfig {
  dsn: string;
  enableTracing: boolean;
  environment: string;
}

const sentryConfig: SentrySetupConfig = {
  dsn: 'https://example-public-key@sentry.io/project-id',
  enableTracing: true,
  environment: 'production',
};

Sentry.init({
  dsn: sentryConfig.dsn,
  tracesSampleRate: 0.2,
  environment: sentryConfig.environment,
});
```

### Datadog Real User Monitoring (RUM)
Datadog captures network request latencies, UI screen transitions, view load times, and custom interaction tracing logs.

```typescript
import { DdSdkReactNative, DdSdkReactNativeConfiguration } from '@datadog/mobile-react-native';

export interface DatadogSetupConfig {
  clientToken: string;
  applicationId: string;
  environment: string;
}

const datadogConfig: DatadogSetupConfig = {
  clientToken: 'pub-client-token',
  applicationId: 'app-uuid-identifier',
  environment: 'production',
};

const ddogConfig = new DdSdkReactNativeConfiguration(
  datadogConfig.clientToken,
  datadogConfig.environment,
  datadogConfig.applicationId,
  true, // track user interactions
  true, // track XHR requests
  true  // track errors
);

DdSdkReactNative.initialize(ddogConfig);
```
