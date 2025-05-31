import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';

const fakeUserData = [
  {
    id: 1,
    email: 'test1@email.com',
    created_at: new Date(),
    role_id: 1,
    deleted: false,
  },
  {
    id: 2,
    email: 'test2@email.com',
    created_at: new Date(),
    role_id: 1,
    deleted: false,
  },
  {
    id: 3,
    email: 'test3@email.com',
    created_at: new Date(),
    role_id: 1,
    deleted: false,
  },
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .useMocker((token) => {
        console.log('dinov log token', token);
        if (token === DatabaseModule) {
          return {
            users: {
              findAll: jest.fn().mockRejectedValue(fakeUserData),
            },
          };
        }
      })
      .compile();

    usersController = moduleRef.get(UsersController);
    usersService = moduleRef.get(UsersService);
  });

  describe('findAll', () => {
    it('should return a array of users', async () => {
      const result = ['test'];
      jest.spyOn(usersService, 'findAll').mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve([
            {
              id: 1,
              email: 'test@email.com',
              created_at: new Date(),
              role_id: 1,
              deleted: false,
            },
          ]);
        });
      });

      expect(await usersController.findAll()).toBe(result);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });
});
