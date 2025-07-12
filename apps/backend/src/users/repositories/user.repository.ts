import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeormRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.typeormRepository.create(userData);
    return await this.typeormRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.typeormRepository.save(user);
  }

  async findById(id: number): Promise<Partial<User> | null> {
    return await this.typeormRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name'],
    });
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    return await this.typeormRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.typeormRepository.findOne({
      where: { email },
    });
  }

  async findAll(): Promise<Partial<User>[]> {
    return await this.typeormRepository.find({
      select: ['id', 'email', 'name'],
    });
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.typeormRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    Object.assign(user, userData);
    return await this.typeormRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.typeormRepository.findOne({ where: { id } });
    if (!user) {
      return false;
    }

    await this.typeormRepository.delete(id);
    return true;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.typeormRepository.count({ where: { email } });
    return count > 0;
  }
}