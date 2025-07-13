import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResult = {
        access_token: 'mock.jwt.token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await authController.login(loginDto);

      expect(result).toEqual(mockResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };
      const mockResult = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await authController.register(registerDto);

      expect(result).toEqual(mockResult);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = {
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      } as any;

      const result = authController.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});