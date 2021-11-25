import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  username: 'Someuser',
  id: 'someid',
  password: 'somepassword',
  tasks: [],
};

const mockTask: Task = {
  id: 'someId',
  title: 'taskTitle',
  description: 'taskDescription',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository; //: TasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = await module.get(TasksService);
    tasksRepository = await module.get(TasksRepository);
  });

  describe('GetTasks', () => {
    it('calls TasksRespoisitory.getTasks and returns a list of Task', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();

      tasksRepository.getTasks.mockResolvedValue('someValue');

      const result = await tasksService.getTasksWithFilter(null, mockUser);

      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('GetTasksById', () => {
    it('calls TasksRepository.findOne with no matches and returns an exception', async () => {
      tasksRepository.findOne.mockResolvedValue(false);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('calls TasksRepository.findOne with matche and returns Task', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);

      const task = await tasksService.getTaskById('someId', mockUser);

      expect(task).toEqual(mockTask);
    });
  });
});
