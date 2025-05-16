import { test, expect } from '@playwright/test';

// This test assumes the app is running locally at http://localhost:3000
// and that the database and S3 are properly configured.

test.describe('User Registration Flow', () => {
  test('should register a new user and display in the user list', async ({ page }) => {
    await page.goto('http://localhost:3000/(main)/user-management');

    // Fill in the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser-e2e@example.com');
    // Upload a valid image file (ensure test-profile.jpg exists in the tests/assets folder)
    const filePath = 'tests/assets/test-profile.jpg';
    await page.setInputFiles('input[type="file"]', filePath);

    // Submit the form
    await page.click('button[type="submit"]');

    // Expect a success notification
    await expect(page.locator('.notification-success')).toBeVisible();

    // User should appear in the list
    await expect(page.locator('td', { hasText: 'Test User' })).toBeVisible();
    await expect(page.locator('td', { hasText: 'testuser-e2e@example.com' })).toBeVisible();
    // Photo preview should be visible
    await expect(page.locator('img[alt="Test User"]')).toBeVisible();
  });
});
