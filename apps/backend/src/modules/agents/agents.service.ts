import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryAgent } from 'src/modules/agents/discovery.agent';
import { StructurerAgent } from 'src/modules/agents/structurer.agent';
import { PubSubService } from 'src/modules/pubsub/pubsub.service';

@Injectable()
export class AgentsService {
  constructor(private readonly pubsubService: PubSubService) {}

  private readonly logger = new Logger(AgentsService.name);
  private readonly discovery = new DiscoveryAgent();
  private readonly structurer = new StructurerAgent();

  async processGenerateQuestions(
    processId: string,
    uid: string,
    message: string,
    language: string,
  ) {
    try {
      this.logger.log(
        `Processing task with processId: ${processId}, uid: ${uid}, message: ${message}, language: ${language}`,
      );
      await this.pubsubService.publish(uid, {
        kind: 'progress',
        step: 'creating-questions',
        processId,
      });

      this.logger.log('Running discovery agent');
      const raw = await this.discovery.run({ message, language });

      this.logger.log('Discovery agent completed');
      await this.pubsubService.publish(uid, {
        kind: 'progress',
        step: 'structuring-questions',
        processId,
      });

      this.logger.log('Running structurer agent');
      const structured = await this.structurer.run(raw);

      this.logger.log('Structurer agent completed');
      await this.pubsubService.publish(uid, {
        kind: 'result',
        processId,
        questionsResult: structured,
        context: message,
      });
    } catch (err) {
      await this.pubsubService.publish(uid, {
        kind: 'error',
        processId,
        message: (err as Error).message,
      });
      throw err;
    }
  }
}
