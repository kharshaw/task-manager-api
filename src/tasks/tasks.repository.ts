import { Logger } from '@nestjs/common';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private readonly logger = new Logger(TasksRepository.name);

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasks(filterDto?: GetTasksFilterDto): Promise<Task[]> {
    this.logger.log('getTasks');

    const { status, search } = filterDto;

    let query: SelectQueryBuilder<Task> = this.createQueryBuilder('todos');

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
