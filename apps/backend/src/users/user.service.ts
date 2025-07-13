import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { IUserRepository } from './user-repository.interface';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Business Logic: Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(createUserDto.email);
    if (emailExists) {
      throw new BadRequestException('User with this email already exists');
    }

    // Business Logic: Hash password for security
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Delegate data persistence to repository
    return await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<Partial<User>[]> {
    // Pure delegation - no business logic needed
    return await this.userRepository.findAll();
  }

  async findOne(id: number): Promise<Partial<User>> {
    // Business Logic: Validate existence and throw appropriate error
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // For auth purposes - returns user with password
    return await this.userRepository.findByEmailWithPassword(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Business Logic: Hash password if provided
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    // Business Logic: Validate existence and handle errors
    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    // Business Logic: Validate existence before deletion
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Business Logic: Password validation for authentication
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Private helper method for business logic
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}