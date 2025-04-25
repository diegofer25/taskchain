import { Module } from '@nestjs/common';
import { TasksController } from 'src/modules/tasks/tasks.controllers';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
