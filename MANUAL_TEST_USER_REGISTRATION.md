# Manual Test Cases: User Registration Flow (End-to-End)

## 1. Register a New User (Happy Path)

- Navigate to the User Management page.
- Fill in the Name and Email fields with valid data.
- Upload a valid profile photo (e.g., .jpg, .png).
- Click the "Add User" button.
- **Expected:**
  - Success notification appears.
  - The new user appears in the user list with correct name, email, and photo preview.
  - The user is stored in the database (check via DB or API GET /api/users).
  - The profile photo is uploaded to S3 (check S3 bucket).

## 2. Register with Missing Fields

- Leave one or more fields (Name, Email, Photo) empty.
- Click "Add User".
- **Expected:**
  - Error message appears indicating missing required fields.
  - No user is created.

## 3. Register with Invalid Email

- Enter an invalid email format (e.g., "user@invalid").
- Fill other fields correctly.
- Click "Add User".
- **Expected:**
  - Error message appears for invalid email.
  - No user is created.

## 4. Register with Invalid Photo Type

- Upload a file that is not an image (e.g., .txt, .exe).
- Fill other fields correctly.
- Click "Add User".
- **Expected:**
  - Error message appears for invalid file type.
  - No user is created.

## 5. Duplicate Email Registration

- Register a user with an email that already exists in the system.
- **Expected:**
  - Error message appears for duplicate email.
  - No duplicate user is created.

## 6. Backend/API Error Handling

- Simulate a backend failure (e.g., disconnect DB or S3).
- Try to register a user.
- **Expected:**
  - Error message appears for failed registration.
  - No user is created.

## 7. Verify Data Consistency

- After successful registration, refresh the page.
- **Expected:**
  - The new user still appears in the list.
  - The photo URL is valid and loads the image from S3.

---

# (Optional) Automated Test Plan

- Use Playwright or Cypress for E2E UI tests.
- Use Jest/Supertest for API integration tests.
- (See next steps for code if requested.)
