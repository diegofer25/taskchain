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
    this.processGenerateQuestions(uid, message, language);
    return {
      processing: true,
    };
  }

  private processGenerateQuestions(
    uid: string,
    message: string,
    language: string,
  ) {
    this.pubSub
      .sendToUser(uid, {
        event: 'task_processing',
        data: {
          message: 'Processing your request...',
        },
      })
      .catch((error) => {
        console.error('Failed to send processing message to user:', error);
      });
    this.discovery
      .run({ message, language })
      .then((raw) => {
        this.pubSub
          .sendToUser(uid, {
            event: 'task_discovery',
            data: {
              questions: raw,
            },
          })
          .catch((sendError) => {
            console.error(
              'Failed to send discovery message to user:',
              sendError,
            );
          });

        return this.structurer.run(raw).then((structured) => {
          this.pubSub
            .sendToUser(uid, {
              event: 'task_structured',
              data: {
                questions: structured,
              },
            })
            .catch((sendError) => {
              console.error(
                'Failed to send structurer message to user:',
                sendError,
              );
            });
        });
      })
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
  }
}
