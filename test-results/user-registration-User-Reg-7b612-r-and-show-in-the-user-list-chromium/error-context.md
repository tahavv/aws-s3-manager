# Test info

- Name: User Registration Flow >> should register a new user and show in the user list
- Location: C:\Users\LENOVO\Desktop\Iteam\aws-s3-uploader\tests\user-registration.spec.ts:8:7

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

    at C:\Users\LENOVO\Desktop\Iteam\aws-s3-uploader\tests\user-registration.spec.ts:12:16
```

# Page snapshot

```yaml
- navigation:
    - link "AWS S3 Manager":
        - /url: /
    - list:
        - listitem:
            - link "Dashboard":
                - /url: /dashboard
        - listitem:
            - link "Upload":
                - /url: /upload
        - listitem:
            - link "User Management":
                - /url: /user-management
- heading "User Management" [level=2]
- text: Name
- textbox "Enter name"
- text: Email
- textbox "Enter email"
- text: Profile Photo
- button "Choose File"
- button "Add User"
- heading "All Users" [level=3]
- table:
    - rowgroup:
        - row "Photo Name Email Created Actions":
            - cell "Photo"
            - cell "Name"
            - cell "Email"
            - cell "Created"
            - cell "Actions"
    - rowgroup:
        - row "taha123 taha123 tahaayari@gmail.com 5/16/2025, 6:16:15 PM":
            - cell "taha123":
                - img "taha123"
            - cell "taha123"
            - cell "tahaayari@gmail.com"
            - cell "5/16/2025, 6:16:15 PM"
            - cell:
                - button "Delete user"
        - row "taha taha taha@gmail.com.tn 5/16/2025, 5:51:13 PM":
            - cell "taha":
                - img "taha"
            - cell "taha"
            - cell "taha@gmail.com.tn"
            - cell "5/16/2025, 5:51:13 PM"
            - cell:
                - button "Delete user"
        - row "test3 test3 test3@gmail.com 5/16/2025, 5:36:14 PM":
            - cell "test3":
                - img "test3"
            - cell "test3"
            - cell "test3@gmail.com"
            - cell "5/16/2025, 5:36:14 PM"
            - cell:
                - button "Delete user"
        - row "test 2 test 2 test1@gmail.com 5/16/2025, 5:32:27 PM":
            - cell "test 2":
                - img "test 2"
            - cell "test 2"
            - cell "test1@gmail.com"
            - cell "5/16/2025, 5:32:27 PM"
            - cell:
                - button "Delete user"
        - row "taha ayari taha ayari test@gmail.com 5/16/2025, 5:31:20 PM":
            - cell "taha ayari":
                - img "taha ayari"
            - cell "taha ayari"
            - cell "test@gmail.com"
            - cell "5/16/2025, 5:31:20 PM"
            - cell:
                - button "Delete user"
- alert
- button "Open Next.js Dev Tools":
    - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // NOTE: This is a basic E2E test for the user registration flow.
   4 | // It assumes your Next.js app is running locally at http://localhost:3000
   5 | // and that the test S3/DB environment is available.
   6 |
   7 | test.describe('User Registration Flow', () => {
   8 |   test('should register a new user and show in the user list', async ({ page }) => {
   9 |     await page.goto('http://localhost:3000/user-management');
  10 |
  11 |     // Fill in the form
> 12 |     await page.fill('input[name="name"]', 'Test User');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  13 |     await page.fill('input[name="email"]', 'testuser-e2e@example.com');
  14 |     // Upload a valid image file (ensure test-profile.jpg exists in your test assets)
  15 |     const filePath = 'tests/assets/test-profile.jpg';
  16 |     await page.setInputFiles('input[type="file"]', filePath);
  17 |
  18 |     // Submit the form
  19 |     await page.click('button[type="submit"]');
  20 |
  21 |     // Expect a success notification
  22 |     await expect(page.locator('text=User added successfully')).toBeVisible({ timeout: 10000 });
  23 |
  24 |     // User should appear in the list
  25 |     await expect(page.locator('text=Test User')).toBeVisible();
  26 |     await expect(page.locator('text=testuser-e2e@example.com')).toBeVisible();
  27 |     // Photo preview should be present
  28 |     await expect(page.locator('img[alt="Test User"]')).toBeVisible();
  29 |   });
  30 | });
  31 |
```
