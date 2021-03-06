import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  public async getTasksWithFilter(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    this.logger.debug('SERVICE getTasksWithFilter');

    const tasks = await this.tasksRepository.getTasks(filterDto, user);
    return tasks;
  }

  public async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task with id: "${id}" not found`);
    }

    return found;
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0)
      throw new NotFoundException(`Task with id "${id}" was not found.`);
  }

  public async patchTaskStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!task) {
      throw new NotFoundException(`Task is id "${id}" not found`);
    }

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
