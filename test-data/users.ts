/**
 * Test User Data
 * Contains predefined test users for various test scenarios
 */

export interface TestUser {
  username: string;
  password: string;
  role: string;
  description: string;
}

export const TEST_USERS = {
  VALID_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
    role: 'standard',
    description: 'Standard user with valid credentials',
  } as TestUser,

  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce',
    role: 'problem',
    description: 'User that experiences various issues during tests',
  } as TestUser,

  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    role: 'performance',
    description: 'User experiencing performance issues',
  } as TestUser,

  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    role: 'locked',
    description: 'Locked out user account',
  } as TestUser,

  INVALID_USER: {
    username: 'invalid_user',
    password: 'invalid_password',
    role: 'invalid',
    description: 'Invalid credentials user',
  } as TestUser,

  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
    role: 'empty',
    description: 'Empty credentials',
  } as TestUser,
};

export const getTestUser = (key: keyof typeof TEST_USERS): TestUser => {
  return TEST_USERS[key];
};
