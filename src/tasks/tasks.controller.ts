import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto?: GetTasksFilterDto): Promise<Task[]> {
    this.logger.log('CONTROLLER getTasks');
    const tasks = await this.tasksService.getTasksWithFilter(filterDto);
    return tasks;
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    this.logger.log('CONTROLLER getTasksById');
    const task = await this.tasksService.getTaskById(id);
    return task;
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string): Promise<void> {
    return await this.tasksService.deleteTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  async patchTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;

    return await this.tasksService.patchTaskStatusById(id, status);
  }
}
