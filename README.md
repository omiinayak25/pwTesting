# Enterprise-Grade E2E Testing Suite with Playwright

A professional, production-ready automation testing framework built with Playwright, demonstrating expert-level testing practices and patterns.

## 🎯 Project Overview

This project showcases a comprehensive end-to-end testing suite that serves as a **major interview project** demonstrating:

- ✅ **Page Object Model (POM)** with base classes and inheritance
- ✅ **Advanced test patterns** (data-driven, parameterized, fixtures)
- ✅ **Comprehensive logging** and reporting
- ✅ **Test data management** and factories
- ✅ **Utility classes** for common operations
- ✅ **CI/CD integration ready**
- ✅ **Professional code organization** and TypeScript strict mode
- ✅ **Multiple test scenarios** covering happy paths and edge cases
- ✅ **Cross-browser testing** configuration
- ✅ **Best practices** in automation testing

## 📂 Project Structure

```
playwright-automation-testing/
├── test-data/                    # Test data and fixtures
│   ├── users.ts                 # Test user credentials
│   └── products.ts              # Product test data
├── pages/                        # Page Object Models
│   ├── BasePage.ts              # Base class with common methods
│   ├── LoginPage.ts             # Login page object
│   ├── InventoryPage.ts         # Products/Inventory page object
│   ├── CartPage.ts              # Shopping cart page object
│   └── CheckoutPage.ts          # Checkout flow page objects
├── fixtures/                     # Playwright fixtures
│   └── baseFixture.ts           # Custom fixture with hooks
├── utils/                        # Utility classes
│   ├── logger.ts                # Centralized logging
│   ├── waitUtils.ts             # Common wait patterns
│   └── screenshotHelper.ts      # Screenshot utilities
├── tests/                        # Test specifications
│   ├── login.spec.ts            # Login tests
│   ├── shopping.spec.ts         # Shopping cart tests
│   └── checkout.spec.ts         # Checkout flow tests
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
└── package.json                # Project dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-automation-testing

# Install dependencies
npm install
```

### Configuration

1. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables** in `.env`:
   ```
   BASE_URL=https://www.saucedemo.com
   PLAYWRIGHT_HEADLESS=false
   LOG_LEVEL=info
   ```

## 📝 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run smoke tests only
npm run test:smoke

# Run regression tests only
npm run test:regression
```

### Cross-Browser Testing

```bash
# Run on Chrome
npm run test:chrome

# Run on Firefox
npm run test:firefox

# Run on Safari
npm run test:webkit

# Run on all browsers
npm test
```

### Parallel Execution

```bash
# Run with 4 workers
npm run test:parallel

# Run serially (1 worker)
npm run test:serial
```

### View Test Reports

```bash
# Open HTML report
npm run test:report
```

## 📊 Key Features

### 1. **Page Object Model (POM)**

Clean separation of page interactions from test logic:

```typescript
// pages/LoginPage.ts
export class LoginPage extends BasePage {
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username, 'Username Field');
    await this.fill(this.passwordField, password, 'Password Field');
    await this.click(this.loginButton, 'Login Button');
  }
}

// tests/login.spec.ts
await loginPage.login(username, password);
```

### 2. **Centralized Logging**

Track test execution with detailed logging:

```typescript
import { logger } from '../utils/logger';

logger.info('Starting login process');
logger.pass('Login successful');
logger.fail('Login failed');
logger.warn('Potential issue detected');
logger.error('Critical error occurred');
```

### 3. **Test Data Management**

Organized test data with type safety:

```typescript
import { getTestUser } from '../test-data/users';
import { PRODUCTS } from '../test-data/products';

const user = getTestUser('VALID_USER');
const product = PRODUCTS.BACKPACK;
```

### 4. **Reusable Utilities**

Common operations abstracted into utility classes:

```typescript
// Wait patterns
await WaitUtils.waitForElementVisible(element, 10000, 'Element Name');
await WaitUtils.waitForURL(page, /.*inventory/);
await WaitUtils.waitForNetworkIdle(page);

// Base page methods
await page.fill(selector, value, label);
await page.click(selector, label);
await page.verifyElementVisible(selector, label);
```

### 5. **Comprehensive Test Coverage**

Multiple test scenarios covering:

- Happy paths (successful workflows)
- Error cases (invalid inputs, locked accounts)
- Edge cases (rapid attempts, empty fields)
- Cross-page navigation
- Data validation

## 🧪 Test Categories

### Smoke Tests (`@smoke`)

Quick validation tests that run frequently. Located in:

- `tests/login.spec.ts` - Login functionality
- `tests/shopping.spec.ts` - Basic shopping operations

### Regression Tests (`@regression`)

Comprehensive tests covering all functionality:

- `tests/login.spec.ts` - Login validations
- `tests/shopping.spec.ts` - Cart management
- `tests/checkout.spec.ts` - Complete checkout flow

Run specific test categories:

```bash
npm run test:smoke      # Run all smoke tests
npm run test:regression # Run all regression tests
```

## 🔧 Configuration Details

### Playwright Config (`playwright.config.ts`)

- **Base URL**: Configured via `.env`
- **Timeouts**:
  - Navigation: 30s
  - Action: 10s
  - Test: 60s
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Traces**: Retained on failure
- **Parallel**: Enabled by default

### TypeScript Config (`tsconfig.json`)

- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ES2020
- **Module Resolution**: Bundler
- **Path Aliases**:
  - `@pages/*` → `pages/*`
  - `@tests/*` → `tests/*`
  - `@utils/*` → `utils/*`
  - `@data/*` → `test-data/*`

## 📋 Test Examples

### Login Test

```typescript
test('should login successfully with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = getTestUser('VALID_USER');

  await loginPage.navigate();
  await loginPage.login(user.username, user.password);

  await expect(page).toHaveURL(/.*inventory/);
});
```

### Shopping Cart Test

```typescript
test('should add multiple products to cart', async ({ page }) => {
  await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);
  await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT.id);

  const cartCount = await inventoryPage.getCartItemCount();
  expect(cartCount).toBe(2);
});
```

### Checkout Test

```typescript
test('should complete full checkout flow', async ({ page }) => {
  await cartPage.clickCheckout();
  await checkoutInfoPage.fillCheckoutInfo('John', 'Doe', '12345');
  await checkoutInfoPage.clickContinue();

  await checkoutOverviewPage.verifyCheckoutOverviewPageIsLoaded();
  await checkoutOverviewPage.clickFinish();

  await checkoutCompletePage.verifyCheckoutIsComplete();
});
```

## 🛠️ Code Quality

### Formatting

```bash
npm run format       # Format all files
npm run format:check # Check formatting without changes
```

### Linting

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Clean Up

```bash
npm run clean        # Remove test results and reports
```

## 📈 Best Practices Demonstrated

### 1. **Single Responsibility Principle**

- Each page object handles one page
- Each utility class handles one concern
- Each test focuses on one scenario

### 2. **DRY (Don't Repeat Yourself)**

- BasePage class provides common methods
- Utility classes prevent code duplication
- Test data centralized

### 3. **KISS (Keep It Simple, Stupid)**

- Clear naming conventions
- Readable assertions
- Logical test organization

### 4. **Type Safety**

- TypeScript strict mode enabled
- Interfaces for test data
- Type hints on all functions

### 5. **Maintainability**

- Clear test descriptions
- Organized file structure
- Comprehensive logging
- Well-documented code

## 🚀 CI/CD Integration

Configure with GitHub Actions, Jenkins, or other CI tools:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Upload reports
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Interview Talking Points

1. **Test Organization**: Explain the POM pattern and why it's beneficial
2. **Code Quality**: Discuss TypeScript strict mode and linting
3. **Scalability**: Show how to add new pages and tests easily
4. **Maintainability**: Demonstrate the base class pattern
5. **Logging**: Explain the logging strategy for debugging
6. **CI/CD**: Discuss integration with CI/CD pipelines
7. **Test Data**: Show data-driven testing approach
8. **Best Practices**: Highlight industry standards implemented

## 🔍 Debugging Failed Tests

### View Test Report

```bash
npm run test:report
```

### Run in Debug Mode

```bash
npm run test:debug
```

### Run Single Test

```bash
npx playwright test tests/login.spec.ts -g "Login with valid credentials"
```

### View Traces

Tests capture traces on failure, viewable in the HTML report.

## 📞 Support & Troubleshooting

### Common Issues

**Tests timeout:**

- Check `NAVIGATION_TIMEOUT` in `.env`
- Verify internet connection
- Check if application is accessible

**Screenshot not captured:**

- Ensure `screenshots/` directory exists
- Check file permissions

**Logging not showing:**

- Verify `ENABLE_CONSOLE_LOGGING=true` in `.env`
- Check `LOG_LEVEL` setting

## 📝 License

ISC

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices in Test Automation](https://testautomationu.applitools.com)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Created for demonstration of expert-level automation testing practices**
