import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

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
    });
  });
});
