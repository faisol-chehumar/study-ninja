import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      
      // Mock user validation logic
      const result = await authService.validateUser('test@example.com', 'password');
      
      expect(result).toBeDefined();
    });

    it('should return null for invalid credentials', async () => {
      const result = await authService.validateUser('invalid@example.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token for valid user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';
      
      mockJwtService.sign.mockReturnValue(mockToken);
      
      const result = await authService.login(mockUser);
      
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };
      
      const result = await authService.register(registerDto);
      
      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(result).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should throw error for duplicate email', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };
      
      // First registration should succeed
      await authService.register(registerDto);
      
      // Second registration with same email should throw
      await expect(authService.register(registerDto)).rejects.toThrow();
    });
  });
});