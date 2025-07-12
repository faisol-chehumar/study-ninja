import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: number;
  email: string;
  name: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}