import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { GenerateQuestionsResponse } from '@taskchain/types';
import { UserInfo } from 'firebase-admin/auth';
import { ZodValidationPipe } from 'nestjs-zod';
import { FirebaseUser } from 'src/modules/firebase/firebase.decorator';
import { CreateTaskDto } from 'src/modules/tasks/tasks.dto';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(ZodValidationPipe)
  create(
    @Body() body: CreateTaskDto,
    @FirebaseUser() user: UserInfo,
  ): GenerateQuestionsResponse {
    return this.service.generateQuestions(user.uid, body);
  }
}
