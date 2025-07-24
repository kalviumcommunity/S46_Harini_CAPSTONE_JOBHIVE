import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/userSchema.js';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  password: 'password123',
  role: 'Job Seeker'
};

// Mock express app
const app = {
  post: jest.fn(),
  get: jest.fn()
};

// Before all tests, connect to test database
beforeAll(async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST);
      console.log('Connected to test database');
    }
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
});

// After all tests, close database connection
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Closed test database connection');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
});

// Before each test, clear the database
beforeEach(async () => {
  try {
    await User.deleteMany({});
    console.log('Cleared test database');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
});

// Test Suite 1: User Schema Validation
describe('User Schema Validation', () => {
  it('should validate a valid user', async () => {
    const validUser = new User(testUser);
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(testUser.email);
  });

  it('should fail validation for invalid email', async () => {
    const userWithInvalidEmail = new User({
      ...testUser,
      email: 'invalid-email'
    });
    await expect(userWithInvalidEmail.save()).rejects.toThrow();
  });

  it('should fail validation for short name', async () => {
    const userWithShortName = new User({
      ...testUser,
      name: 'Ab' // Less than 3 characters
    });
    await expect(userWithShortName.save()).rejects.toThrow();
  });
});

// Test Suite 2: Password Validation and Hashing
describe('Password Validation and Hashing', () => {
  it('should hash password before saving', async () => {
    const user = new User(testUser);
    const savedUser = await user.save();
    expect(savedUser.password).not.toBe(testUser.password);
  });

  it('should correctly compare valid password', async () => {
    const user = new User(testUser);
    await user.save();
    const isMatch = await user.comparePassword(testUser.password);
    expect(isMatch).toBe(true);
  });

  it('should fail for invalid password', async () => {
    const user = new User(testUser);
    await user.save();
    const isMatch = await user.comparePassword('wrongpassword');
    expect(isMatch).toBe(false);
  });
});

// Test Suite 3: Role Validation
describe('Role Validation', () => {
  it('should accept valid role - Job Seeker', async () => {
    const user = new User(testUser);
    const savedUser = await user.save();
    expect(savedUser.role).toBe('Job Seeker');
  });

  it('should accept valid role - Employer', async () => {
    const employerUser = new User({
      ...testUser,
      role: 'Employer'
    });
    const savedUser = await employerUser.save();
    expect(savedUser.role).toBe('Employer');
  });

  it('should reject invalid role', async () => {
    const userWithInvalidRole = new User({
      ...testUser,
      role: 'Invalid Role'
    });
    await expect(userWithInvalidRole.save()).rejects.toThrow();
  });
});

// Test Suite 4: JWT Token Generation
describe('JWT Token Generation', () => {
  it('should generate valid JWT token', async () => {
    const user = new User(testUser);
    await user.save();
    const token = user.getJWTToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should generate different tokens for different users', async () => {
    const user1 = new User(testUser);
    await user1.save();
    const token1 = user1.getJWTToken();

    const user2 = new User({
      ...testUser,
      email: 'test2@example.com'
    });
    await user2.save();
    const token2 = user2.getJWTToken();

    expect(token1).not.toBe(token2);
  });
});

// Test Suite 5: Phone Number Validation
describe('Phone Number Validation', () => {
  it('should accept valid phone number', async () => {
    const user = new User(testUser);
    const savedUser = await user.save();
    expect(savedUser.phone).toBe(parseInt(testUser.phone));
  });

  it('should require phone number', async () => {
    const userWithoutPhone = new User({
      ...testUser,
      phone: undefined
    });
    await expect(userWithoutPhone.save()).rejects.toThrow();
  });

  it('should convert string phone number to number', async () => {
    const user = new User({
      ...testUser,
      phone: '9876543210'
    });
    const savedUser = await user.save();
    expect(typeof savedUser.phone).toBe('number');
  });
}); 

// User data validation
// Password security features
// Role-based access control
// JWT token functionality
// Phone number handling