import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { GenerateQuestionsResponse } from '@taskchain/types';
import { DiscoveryAgent } from 'src/modules/agents/discovery.agent';
import { StructurerAgent } from 'src/modules/agents/structurer.agent';
import { PUBSUB_CLIENT } from 'src/modules/pubsub/pubsub.module';
import { CreateTaskDto } from 'src/modules/tasks/tasks.dto';

@Injectable()
export class TasksService {
  private discovery = new DiscoveryAgent();
  private structurer = new StructurerAgent();

  constructor(
    @Inject(PUBSUB_CLIENT) private readonly pubSub: WebPubSubServiceClient,
  ) {}

  generateQuestions(
    uid: string,
    { language, message }: CreateTaskDto,
  ): GenerateQuestionsResponse {
    this.discovery
      .run({ message, language })
      .then((raw) => this.structurer.run(raw))
      .catch((error) => {
        this.pubSub
          .sendToUser(uid, {
            event: 'task_error',
            data: {
              error: (error as Error).message,
            },
          })
          .catch((sendError) => {
            console.error('Failed to send error message to user:', sendError);
          });
      });

    return {
      processing: true,
    };
  }
}
