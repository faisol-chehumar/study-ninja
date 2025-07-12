import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/user.entity';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    
    await app.init();
  });

  afterEach(async () => {
    // Clean up database after each test
    await userRepository.clear();
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body.password).toBeDefined(); // Should be hashed
      expect(response.body.password).not.toBe(createUserDto.password);
    });

    it('should return 400 if email already exists', async () => {
      const createUserDto = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should return array of users without passwords', async () => {
      const user1 = {
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
      };
      const user2 = {
        email: 'user2@example.com',
        password: 'password456',
        name: 'User 2',
      };

      // Create test users
      await request(app.getHttpServer()).post('/users').send(user1);
      await request(app.getHttpServer()).post('/users').send(user2);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id without password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/999')
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;
      const updateDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe(updateDto.name);
      expect(response.body.email).toBe(updateDto.email);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .patch('/users/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      const userId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200);

      // Verify user is deleted
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .delete('/users/999')
        .expect(404);
    });
  });
});