import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private readonly logger = new Logger(TasksRepository.name, true);

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    let task: Task;

    try {
      task = this.create({
        title: title,
        description: description,
        status: TaskStatus.OPEN,
        user,
      });

      await this.save(task);
    } catch (error) {
      this.logger.error(
        `Error creating task "${JSON.stringify(createTaskDto)}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    this.logger.log('getTasks');

    const { status, search } = filterDto;

    // eslint-disable-next-line prettier/prettier
    let query: SelectQueryBuilder<Task> = this.createQueryBuilder('todos').where({ user });

    if (status) {
      query = query.andWhere('todos.status = :status', {
        status: status,
      });
    }

    if (search) {
      query = query.andWhere(
        '(LOWER(todos.title) like :search or LOWER(todos.description) like :search)',
        { search: `%${search.toLocaleLowerCase()}%` },
      );
    }

    this.logger.verbose(query.getSql());

    const tasks: Task[] = await query.getMany();
    return tasks;
  }
}
