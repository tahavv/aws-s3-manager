import { test, expect } from '@playwright/test';

// NOTE: This is a basic E2E test for the user registration flow.
// It assumes your Next.js app is running locally at http://localhost:3000
// and that the test S3/DB environment is available.

test.describe('User Registration Flow', () => {
  test('should register a new user and show in the user list', async ({ page }) => {
    await page.goto('http://localhost:3000/user-management');

    // Fill in the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser-e2e@example.com');
    // Upload a valid image file (ensure test-profile.jpg exists in your test assets)
    const filePath = 'tests/assets/test-profile.jpg';
    await page.setInputFiles('input[type="file"]', filePath);

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect a success notification
    await expect(page.locator('text=User added successfully')).toBeVisible({ timeout: 10000 });

    // User should appear in the list
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=testuser-e2e@example.com')).toBeVisible();
    // Photo preview should be present
    await expect(page.locator('img[alt="Test User"]')).toBeVisible();
  });
});
