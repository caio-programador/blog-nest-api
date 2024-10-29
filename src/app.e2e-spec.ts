import 'dotenv/config'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { CreateUserDto } from './users/dto/create-user.dto'
import { User } from './users/entities/user.entity'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './users/entities/role.entity'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { PostEntity } from './posts/entities/post.entity'
import { Category } from './posts/entities/category.entity'
import * as request from 'supertest'
import { AuthModule } from './auth/auth.module'
import { PostsModule } from './posts/posts.module'
import { LoginDto } from './auth/dto/login.dto'
import { UpdateUserDto } from './users/dto/update-user.dto'
import { CreatePostDto } from './posts/dto/create-post.dto'

describe('App end-two-end', () => {
  let app: INestApplication
  let module: TestingModule
  let createUserDto: CreateUserDto
  let token: string
  let createPostDto: CreatePostDto

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5434,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Role, PostEntity, Category],
    synchronize: true,
    dropSchema: true,
  }
  

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
        PostsModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest
          }
        })
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    createUserDto = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
    }
    
    createPostDto = {
      title: 'Post title',
      description: 'Post description',
      categories: ['Category 1', 'Category 2'],
    }

    const dataSource = await new DataSource(dataSourceTest).initialize()
    const roleRepository = dataSource.getRepository(Role)
    await roleRepository.delete({})
    const roles = roleRepository.create([{ role: 'ADMIN' }, { role: 'USER' }])
    await roleRepository.save(roles)
    await dataSource.destroy()

  })


  afterAll(async () => {
    await app.close()
    await module.close()
  })

  describe('POST /users/register', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/register')
        .send(createUserDto)
        .expect(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.name).toStrictEqual(createUserDto.name)
      expect(res.body.email).toStrictEqual(createUserDto.email)
    })
    it('should return 409 if email already exists', async () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send(createUserDto)
        .expect(409)
    })
  })
  describe('POST /auth/login', () => {
    it('should return 200 and a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: createUserDto.email,
          password: createUserDto.password,
        } as LoginDto)
        .expect(200)
        
      token = res.body.accessToken
    })
    it('should return 400 if email or password is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'invalid-password',
        })
        .expect(400)
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: createUserDto.email,
          password: 'invalid-password',
        })
        .expect(400)
    })
  })

  describe('GET /users/details', () => {
    it('should return all users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/details')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      
    })
    it('should return 401 if token is invalid', async () => {
      await request(app.getHttpServer())
        .get('/users/details')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
    })
  })
  describe('PATCH /users/edit', () => {
    it('should update user', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/edit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John Doe Updated',
        } as UpdateUserDto)
        .expect(200)
      
      expect(res.body.name).not.toStrictEqual('John Doe')
    })
  })
  describe('GET /users', () => {
    it('should throw 403', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
    })
  })

  describe('POST /posts/create', () => {
    it('should create a post', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(createPostDto)
        .expect(201)
     })
  })


})