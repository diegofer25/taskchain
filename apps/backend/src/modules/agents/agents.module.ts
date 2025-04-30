import { Module } from '@nestjs/common';
import { AgentsService } from 'src/modules/agents/agents.service';
import { DiscoveryAgent } from 'src/modules/agents/discovery.agent';
import { StructurerAgent } from 'src/modules/agents/structurer.agent';
import { PubsubModule } from 'src/modules/pubsub/pubsub.module';

@Module({
  imports: [PubsubModule],
  providers: [PubsubModule, AgentsService, DiscoveryAgent, StructurerAgent],
  exports: [AgentsService],
})
export class AgentsModule {}
