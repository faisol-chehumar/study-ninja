
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser, LoginResponse } from './interfaces';

@Injectable()
export class AuthService {
  private users = [];

  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<AuthenticatedUser | null> {
    const user = this.users.find(user => user.email === email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthenticatedUser> {
    const existingUser = this.users.find(user => user.email === registerDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      id: this.users.length + 1,
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    };
    this.users.push(newUser);
    const { password, ...result } = newUser;
    return result;
  }
}
