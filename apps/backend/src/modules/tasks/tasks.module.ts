import { Module } from '@nestjs/common';
import { AgentsModule } from 'src/modules/agents/agents.module';
import { TasksController } from 'src/modules/tasks/tasks.controllers';
import { TasksService } from 'src/modules/tasks/tasks.service';

@Module({
  imports: [AgentsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
