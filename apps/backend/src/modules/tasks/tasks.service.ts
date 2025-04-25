import { Injectable } from '@nestjs/common';
import { TaskQuestions } from 'src/modules/agents/agents.schema';
import { DiscoveryAgent } from 'src/modules/agents/discovery.agent';
import { StructurerAgent } from 'src/modules/agents/structurer.agent';

@Injectable()
export class TasksService {
  private discovery = new DiscoveryAgent();
  private structurer = new StructurerAgent();

  async generateQuestions(
    message: string,
    language: string,
  ): Promise<TaskQuestions> {
    const raw = await this.discovery.run({ message, language });
    return await this.structurer.run(raw);
  }
}
