# CI/CD and DevOps Guide (GitHub Actions & Expo EAS)

Automating code quality validation (CI) and build deployment (CD) ensures rapid release cycles and stability. This guide details our industry-standard pipeline utilizing **GitHub Actions** for testing and verification, and **Expo EAS (Expo Application Services)** for automated cloud builds and deployments.

---

## 1. Continuous Integration (CI): GitHub Actions

We have configured a GitHub Actions workflow to run quality validation automatically on every commit and pull request.

* **Configuration File**: [.github/workflows/ci.yml](file:///Users/ajay/Documents/ReactNativeAppProduction/.github/workflows/ci.yml)
* **Pipeline Jobs**:
  1. **Checkout Code**: Grabs the latest commit.
  2. **Setup Node.js**: Installs Node environment caching npm packages.
  3. **Install Dependencies**: Installs workspace libraries with `--legacy-peer-deps`.
  4. **Run TypeScript Compile Check**: Performs static type checks using `npx tsc --noEmit`.
  5. **Run Jest Test Suite**: Executes all Jest unit and integration tests.

---

## 2. Continuous Delivery (CD): Expo EAS Cloud Builds

EAS compiles the application binaries inside clean cloud virtual environments (macOS for iOS, Linux for Android), signing the code with App Store / Google Play credentials automatically.

### Automated CD with GitHub Actions
To automate builds and store submissions when code is merged or a release tag is created:

#### Step 1: Generate an Expo Access Token
1. Go to your [Expo Account Settings](https://expo.dev/settings/access-tokens).
2. Click **Create Token** and copy the generated token.

#### Step 2: Configure GitHub Secrets
1. In your GitHub repository, navigate to **Settings > Secrets and variables > Actions**.
2. Create a new repository secret:
   * Name: `EXPO_TOKEN`
   * Value: *[Your Expo Access Token]*

#### Step 3: Add the CD Job to GitHub Actions
You can append a build job to your workflow file to trigger builds automatically on push events targeting release branches or tags:

```yaml
  deploy:
    needs: validate
    if: startsWith(github.ref, 'refs/tags/v') # Trigger only on version tags (e.g. v1.0.0)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node & EAS
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Install Dependencies
        run: npm install --legacy-peer-deps

      - name: Build & Submit (Android)
        run: eas build --platform android --profile production --non-interactive --auto-submit
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Build & Submit (iOS)
        run: eas build --platform ios --profile production --non-interactive --auto-submit
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 3. EAS Update Rollout & Rollback Strategies

EAS Update deploys JavaScript and asset changes directly to active devices matching the current native runtime shell version.

### Safe Rollout Strategy (Staging -> Production)
1. **Branch Deployments**: Maintain distinct git branches and channels matching those environments:
   * `preview` branch updates the `preview` EAS update channel (for internal QA testing).
   * `main` branch updates the `production` EAS update channel.
2. **Dynamic Testing**: Verify changes in the `preview` build before pushing code changes to `main`.

### Rollback Strategy (Instant Recovery)
If an update containing a bug is pushed to production, you can immediately roll back the environment to the previous stable release bundle:

1. **Rollback Command**:
   Revert the channel's active update to a previous stable publish ID:
   ```bash
   npx eas update:rollback --channel production
   ```
2. **Re-routing Traffic**:
   Alternatively, redeploy the git commit corresponding to the last stable release:
   ```bash
   npx eas update --branch production --message "Rollback to stable version"
   ```
This instantly re-routes active devices to the safe JavaScript bundle on the next launch, neutralizing bugs within seconds without requiring App Store reviews.
