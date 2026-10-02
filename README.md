# QA Assessment — Playwright Automation

## Overview

This repository contains my QA Engineer (Automation) assessment implementation using Playwright and TypeScript.

The automation targets the hosted Conduit Angular SPA:

https://conduit.bondaracademy.com

The suite focuses on reliable end-to-end workflows, API validation, permission/state testing, reusable test architecture, independent test data, cross-browser execution, and CI validation.

---

# Part 1 — Conduit Automation

## Tech Stack

- Playwright
- TypeScript
- Node.js
- REST API testing using Playwright APIRequestContext
- Page Object Model
- Shared Playwright fixtures
- GitHub Actions
- HTML Playwright report

---

## Test Coverage

### 1. Authentication

The authentication journey covers:

- User registration
- User sign-in
- Settings access
- Logout
- Sign-in again

---

### 2. Article Lifecycle

Complete article workflow:

```text
Register
   ↓
Create Article
   ↓
Verify Article
   ↓
Edit Article
   ↓
Verify Updated Article
   ↓
Delete Article
   ↓
Verify Article Returns 404
```

The lifecycle is primarily driven through the UI, with API verification used to confirm the final deletion state.

---

### 3. Permission / State Testing

A second user attempts to modify another user's article.

The suite verifies:

- Non-owner cannot edit through the UI
- Non-owner cannot delete through the UI
- Non-owner receives HTTP 403 when attempting an update through the API
- Non-owner receives HTTP 403 when attempting a delete through the API
- Original owner's article remains unchanged

This provides both UI-level and API-level coverage of the article ownership rule.

---

### 4. API CRUD

The API suite performs the complete article lifecycle without using the UI:

```text
Register
   ↓
Create
   ↓
Read
   ↓
Update
   ↓
Read Updated Article
   ↓
Delete
   ↓
Verify 404
```

Status codes and response payloads are asserted throughout the workflow.

### Expected API Status Codes

| Operation | Expected Status |
|---|---:|
| Register | 201 |
| Login | 200 |
| Create Article | 201 |
| Read Article | 200 |
| Update Article | 200 |
| Delete Article | 204 |
| Read Deleted Article | 404 |
| Non-owner Update | 403 |
| Non-owner Delete | 403 |

---

# Test Data Strategy

Tests generate unique users and article data at runtime.

Example strategy:

```text
qa + unique identifier
```

This avoids collisions between test executions.

Tests do not depend on data created by another test.

Each test creates the data it requires and can be executed independently and repeatedly.

Where API setup is appropriate, state is created through the API instead of unnecessarily navigating through the UI.

---

# Framework Structure

```text
QA-Assessment/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── tests/
│   │
│   ├── api/
│   │   └── article-crud.spec.ts
│   │
│   ├── fixtures/
│   │   └── test-fixtures.ts
│   │
│   ├── pages/
│   │   ├── ArticlePage.ts
│   │   ├── EditorPage.ts
│   │   ├── LoginPage.ts
│   │   └── RegisterPage.ts
│   │
│   ├── test-data/
│   │   └── testData.ts
│   │
│   ├── ui/
│   │   ├── article-lifecycle.spec.ts
│   │   ├── article-permission-ui.spec.ts
│   │   ├── article-permission.spec.ts
│   │   └── authentication.spec.ts
│   │
│   └── utils/
│       └── ApiClient.ts
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

---

# Page Object Model

UI interactions are separated from test scenarios using page objects.

### RegisterPage

Handles:

- Navigation to registration
- Username entry
- Email entry
- Password entry
- Registration

### LoginPage

Handles:

- Login navigation
- Email/password entry
- Sign-in

### EditorPage

Handles:

- Article creation
- Article editing
- Article publishing
- Synchronization with article update responses

### ArticlePage

Handles:

- Article verification
- Edit navigation
- Article deletion
- Delete response verification

This keeps test scenarios focused on business behavior rather than locator implementation.

---

# Shared Fixtures

The framework provides reusable API fixtures using Playwright's `APIRequestContext`.

The API client is injected into tests through the fixture:

```text
apiClient
```

This avoids repeating API setup and keeps API operations reusable.

---

# Synchronization Strategy

No hard-coded sleeps such as:

```text
waitForTimeout()
```

are used.

The framework uses Playwright synchronization mechanisms including:

- `waitForURL`
- `waitForResponse`
- Locator auto-waiting
- `expect(...).toBeVisible()`
- `expect(...).toHaveValue()`
- Response status assertions
- Network-aware navigation

The editor waits for existing article values to be populated before replacing them. This helps avoid Angular data-binding races during cross-browser execution.

---

# Cross-Browser Coverage

The suite runs against:

- Chromium
- Firefox
- WebKit

Final local validation:

```text
15 passed
```

---

# Running Locally

## Prerequisites

- Node.js
- npm

## Install dependencies

```bash
npm ci
```

## Install Playwright browsers

```bash
npx playwright install
```

## Run all tests

```bash
npx playwright test
```

## Run the article lifecycle test

```bash
npx playwright test tests/ui/article-lifecycle.spec.ts
```

## Run a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Open HTML report

```bash
npx playwright show-report
```

---

# CI — GitHub Actions

GitHub Actions runs the Playwright suite on every push and pull request.

Workflow:

```text
.github/workflows/playwright.yml
```

The workflow:

1. Checks out the repository
2. Installs Node.js
3. Installs npm dependencies
4. Installs Playwright browsers
5. Runs the complete test suite
6. Uploads the Playwright HTML report as a build artifact

This provides continuous feedback when changes are pushed to the repository.

---

# Known Limitations

The Conduit application is a public demo application rather than the actual GSP platform.

Therefore:

- GSP-specific admission stages are not available in Conduit.
- GSP Admin / Staff / Agent roles are not available in Conduit.
- Country-specific document configuration is not available in Conduit.
- Agent commission configuration is not available in Conduit.
- The permission tests therefore validate the available Conduit article ownership model rather than artificially implementing GSP roles.

The GSP-specific testing strategy is documented in Part 2 below.

---

# What I Would Add With One More Day

With another day, I would add:

1. More negative API validation cases.
2. Schema-level response validation.
3. Additional authentication failure scenarios.
4. Article validation and boundary cases.
5. More reusable authenticated API fixtures.
6. Test tagging such as smoke and regression.
7. More detailed CI browser-matrix reporting.
8. Accessibility checks for critical workflows.
9. Additional API/UI state correlation.
10. Additional diagnostic reporting for API failures.

---

# Part 2 — GSP Testing Strategy

## 1. Coverage First — Priority Journeys

GSP is a configuration-driven student recruitment platform with a 15-stage admissions lifecycle.

I would automate the following journeys first.

### 1. Student Creation / Enquiry

Validate that a new student can be created and enters the expected initial lifecycle state.

**Reason:**  
This is the entry point for downstream workflows.

### 2. Application Creation

Move a valid student from enquiry into application and verify required data and state transitions.

**Reason:**  
Application data is the foundation for document, offer and visa workflows.

### 3. Country-Specific Document Checklist

Create an application for a destination country and verify that the correct document checklist is generated.

**Reason:**  
Country configuration directly affects whether applications can progress.

### 4. Document Completion

Upload or submit required documents and verify that the application reflects the expected document state.

**Reason:**  
Document completeness is a major workflow gate.

### 5. Offer Workflow

Progress an eligible application through offer generation and acceptance.

**Reason:**  
Offer processing is a critical business transition.

### 6. CAS / Visa Workflow

Validate the transition from offer toward CAS/visa processing and ensure required prerequisites are enforced.

**Reason:**  
This is a high-value state transition with multiple dependencies.

### 7. Enrolment

Validate that an application meeting its prerequisites can reach enrolment and that invalid applications cannot bypass required stages.

**Reason:**  
This validates the end-to-end admissions lifecycle.

### 8. Agent Student Isolation

Create students for different agents and verify that each agent can only access their own students.

**Reason:**  
This is a critical data-isolation requirement.

### 9. Role Permissions

Validate Admin, Staff and Agent access to key operations.

**Reason:**  
Permission regressions can expose or modify student data.

### 10. Configuration Change Regression

Change a country configuration such as the Canada document checklist and verify that existing and new applications behave according to the intended configuration.

**Reason:**  
GSP is configuration-first, so configuration changes should be treated as production-impacting changes.

---

## Ordering Logic

The ordering prioritizes:

```text
Core data creation
        ↓
Lifecycle transitions
        ↓
Configuration-driven behavior
        ↓
Security / permissions
        ↓
High-impact regression scenarios
```

The highest priority is given to workflows that block downstream stages or can expose incorrect student data.

---

# 2. Provably Safe Permissions

The permission strategy should be tested using both positive and negative cases.

## Proposed Permission Matrix

| Capability | Admin | Staff | Agent |
|---|---|---|---|
| View all students | Yes | Yes | No |
| View own students | Yes | Yes | Yes |
| Create/manage students | Yes | Yes | According to business rules |
| Modify application workflow | Yes | Yes | According to business rules |
| Manage country configuration | Yes | No | No |
| Manage document checklists | Yes | No | No |
| Manage commission configuration | Yes | No | No |
| Manage users/roles | Yes | No | No |
| Access another agent's students | Yes | Yes | No |

Where the exact Agent permissions are product-specific, they should be confirmed against the final GSP requirements rather than assumed.

## Permission Test Approach

For every protected capability, I would test:

```text
Role A → allowed operation → expected success

Role B → same operation → expected denial

Role C → same operation → expected denial
```

The tests should cover both:

- UI visibility/action availability
- API authorization

API tests are particularly important because hiding a button does not provide security.

### Agent Data Isolation

Create controlled data:

```text
Agent A
 └── Student A

Agent B
 └── Student B
```

Then verify:

```text
Agent A → Student A → allowed
Agent A → Student B → denied

Agent B → Student B → allowed
Agent B → Student A → denied
```

This should be part of the regression suite.

For critical permissions, I would also verify that direct API requests cannot bypass UI restrictions.

---

# 3. Friday Configuration Change — Canada Checklist

Suppose an administrator changes Canada's document checklist at 5 PM on Friday.

Potential failures include:

- Required document accidentally removed
- Incorrect document made mandatory
- Existing applications receiving unexpected requirements
- New applications receiving an incorrect checklist
- UI showing a different checklist from the API
- Application progression becoming blocked
- Existing students being affected unexpectedly
- Configuration leaking into another country
- Permission regression allowing non-admin users to change configuration
- Cached SPA data showing stale configuration

## Automation Strategy

I would have a configuration regression suite that:

1. Reads the current Canada configuration.
2. Applies the intended change in a controlled test environment.
3. Creates a new Canada application.
4. Verifies the generated checklist.
5. Verifies required and optional document states.
6. Verifies an existing application according to the defined migration behavior.
7. Confirms other destination markets are unchanged.
8. Verifies Staff and Agent cannot modify the configuration.
9. Validates the UI and API representations of the configuration.
10. Runs the critical admissions smoke suite after the change.

The pipeline should run automatically after configuration deployment.

A configuration change should therefore be treated similarly to a code deployment.

---

# 4. Stability — Fast and Non-Flaky Automation

Because GSP is a data-heavy SPA, I would focus on deterministic state and explicit synchronization.

## Data Isolation

Each test should create its own:

- Student
- Application
- Documents
- Agent/user context

Unique identifiers prevent test collisions.

Tests should not depend on data created by another test.

## API-Based Setup

Where possible, APIs should be used to create prerequisite state.

For example:

```text
Create student via API
        ↓
Create application via API
        ↓
Open UI at required workflow state
        ↓
Validate business behavior
```

This makes tests faster and reduces unnecessary UI setup.

## Reliable Waits

Avoid:

```text
sleep
waitForTimeout
```

Prefer:

- URL synchronization
- API response synchronization
- Locator assertions
- State-based waits
- Explicit loading-state assertions where necessary

## Parallelism

Independent tests should run in parallel.

Tests that modify shared configuration should be isolated and serialized where required.

## Retries

Retries should be used primarily in CI for transient infrastructure failures.

Retries should not be used to hide deterministic application failures.

## Test Categorization

I would maintain:

```text
Smoke
Regression
API
Permissions
Configuration
```

This allows fast feedback on every commit while keeping the full regression suite available for deployment validation.

---

# Time Spent

Approximately 4 hours were spent on the assessment, including framework setup, test implementation, debugging, cross-browser validation, CI configuration, and documentation.

---

# Final Assessment Notes

The Conduit implementation demonstrates the automation architecture and workflow testing approach.

The GSP section describes how the same principles would be applied to:

- Lifecycle and state transitions
- Configuration-driven behavior
- Role-based permissions
- Agent data isolation
- Stable CI execution

The key principle is to validate not only whether a page works, but whether the system is in the correct business state and whether the correct user is allowed to perform the operation.