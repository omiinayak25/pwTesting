/**
 * Test User Data
 * Contains predefined test users for various test scenarios
 * Using a factory pattern allows tests to access users by logical name instead of hardcoding credentials
 */

// Define interface for type-safe user objects (ensures all users have required properties)
export interface TestUser {
  username: string;    // Username for login
  password: string;    // Password for login
  role: string;        // User role/type (for documentation)
  description: string; // Human-readable description of what this user represents
}

// Export object containing all test users - centralized test data management
export const TEST_USERS = {
  // Valid user - standard account that should work normally
  VALID_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
    role: 'standard',
    description: 'Standard user with valid credentials',
  } as TestUser,

  // Problem user - account with UI glitches or visual issues
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce',
    role: 'problem',
    description: 'User that experiences various issues during tests',
  } as TestUser,

  // Performance glitch user - account with performance/timing issues
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    role: 'performance',
    description: 'User experiencing performance issues',
  } as TestUser,

  // Locked out user - account that has been locked/blocked
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    role: 'locked',
    description: 'Locked out user account',
  } as TestUser,

  // Invalid user - fake account that doesn't exist
  INVALID_USER: {
    username: 'invalid_user',
    password: 'invalid_password',
    role: 'invalid',
    description: 'Invalid credentials user',
  } as TestUser,

  // Empty credentials - test empty input validation
  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
    role: 'empty',
    description: 'Empty credentials',
  } as TestUser,
};

/**
 * Factory function to retrieve test user by key
 * Usage: const user = getTestUser('VALID_USER');
 * This prevents hardcoding credentials in tests
 * @param key - Key from TEST_USERS object
 * @returns TestUser object with username, password, role, description
 */
export const getTestUser = (key: keyof typeof TEST_USERS): TestUser => {
  // Return the user object by key - throws error if key doesn't exist
  return TEST_USERS[key];
};
