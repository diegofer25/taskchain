import { Module } from '@nestjs/common';
import { PubsubModule } from 'src/modules/pubsub/pubsub.module';
import { TasksController } from 'src/modules/tasks/tasks.controllers';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Module({
  imports: [PubsubModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
