import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from './user-repository.interface';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockRepository = module.get<IUserRepository>('IUserRepository') as jest.Mocked<IUserRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should create a user with hashed password', async () => {
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      
      const savedUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      };

      mockUserRepository.existsByEmail.mockResolvedValue(false); // No existing user
      mockUserRepository.create.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual(savedUser);
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com', name: 'User 1' },
        { id: 2, email: 'user2@example.com', name: 'User 2' },
      ];
      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array if no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email including password', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };
      mockUserRepository.findByEmailWithPassword.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(mockUserRepository.findByEmailWithPassword).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findByEmailWithPassword.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update user successfully', async () => {
      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        name: 'Updated Name',
        password: 'hashedPassword',
      };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateDto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.update.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should hash password if provided in update', async () => {
      const updateWithPassword = { ...updateDto, password: 'newPassword' };
      const hashedPassword = 'hashedNewPassword';
      const updatedUser = { id: 1, email: 'test@example.com', password: hashedPassword, name: 'Test User' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      await service.update(1, updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        ...updateWithPassword,
        password: hashedPassword,
      });
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue(true);

      await service.remove(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue(false);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validatePassword(plainPassword, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const plainPassword = 'wrongPassword';
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validatePassword(plainPassword, hashedPassword);

      expect(result).toBe(false);
    });
  });
});