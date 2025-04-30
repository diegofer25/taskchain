import { Injectable, Logger } from '@nestjs/common';
import { GenerateQuestionsResponse } from '@taskchain/types';
import { randomUUID } from 'node:crypto';
import { AgentsService } from 'src/modules/agents/agents.service';
import { CreateTaskDto } from 'src/modules/tasks/tasks.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly agentsService: AgentsService) {}

  generateQuestions(
    uid: string,
    { language, message }: CreateTaskDto,
  ): GenerateQuestionsResponse {
    const processId = randomUUID();
    this.agentsService
      .processGenerateQuestions(processId, uid, message, language)
      .catch((error) => {
        this.logger.error('Error processing task', error);
      });

    return {
      processing: true,
      processId,
    };
  }
}
