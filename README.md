# OrangeHRM Playwright Framework

A Playwright + TypeScript test automation framework organized with page objects and spec files.

## Project Structure

```text
orangehrm-playwright-framework/
|-- tests/
|   |-- login.spec.ts
|   |-- dashboard.spec.ts
|   |-- admin.spec.ts
|   |-- pim.spec.ts
|   |-- logout.spec.ts
|
|-- pages/
|   |-- LoginPage.ts
|   |-- DashboardPage.ts
|   |-- AdminPage.ts
|   |-- PIMPage.ts
|   |-- BasePage.ts
|
|-- utils/
|-- fixtures/
|-- test-data/
|-- .github/
|   |-- workflows/
|       |-- playwright.yml
|-- playwright.config.ts
|-- package.json
`-- README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

## Run Tests

```bash
npm test
```

## Useful Scripts

- `npm run test:ui` opens Playwright UI mode.
- `npm run test:headed` runs tests in headed browser mode.
- `npm run report` opens the latest HTML report.
