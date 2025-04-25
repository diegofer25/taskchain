import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateTaskDto } from 'src/modules/tasks/tasks.dto';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(ZodValidationPipe)
  async create(@Body() body: CreateTaskDto) {
    return this.service.generateQuestions(body.message, body.language);
  }
}
