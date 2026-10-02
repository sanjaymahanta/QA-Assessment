\# QA Automation Assessment



Playwright + TypeScript automation framework for testing the Conduit Angular SPA.



\## Tech Stack



\- Playwright

\- TypeScript

\- Node.js

\- REST API testing

\- Page Object Model (POM)

\- Playwright Fixtures

\- GitHub Actions

\- HTML Test Reports



\## Application Under Test



\### UI



https://conduit.bondaracademy.com



\### API



https://conduit-api.bondaracademy.com



\---



\# Framework Structure



```text

QA-Assessment/

│

├── .github/

│   └── workflows/

│       └── playwright.yml

│

├── tests/

│   ├── api/

│   │   └── article-crud.spec.ts

│   │

│   ├── fixtures/

│   │   └── test-fixtures.ts

│   │

│   ├── pages/

│   │   ├── LoginPage.ts

│   │   ├── RegisterPage.ts

│   │   ├── EditorPage.ts

│   │   └── ArticlePage.ts

│   │

│   ├── test-data/

│   │   └── testData.ts

│   │

│   ├── ui/

│   │   ├── authentication.spec.ts

│   │   ├── article-lifecycle.spec.ts

│   │   ├── article-permission.spec.ts

│   │   └── article-permission-ui.spec.ts

│   │

│   └── utils/

│       └── ApiClient.ts

│

├── .gitignore

├── package.json

├── package-lock.json

├── playwright.config.ts

└── README.md

