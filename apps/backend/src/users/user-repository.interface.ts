import { User } from './user.entity';

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: number): Promise<Partial<User> | null>;
  findByEmail(email: string): Promise<Partial<User> | null>;
  findByEmailWithPassword(email: string): Promise<User | null>;
  findAll(): Promise<Partial<User>[]>;
  update(id: number, userData: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}