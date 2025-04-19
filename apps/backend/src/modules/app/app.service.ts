import { AIProjectsClient } from '@azure/ai-projects';
import { Inject, Injectable } from '@nestjs/common';
import { AZURE_AI_CLIENT } from '@x2d/azure-ai-nest';

@Injectable()
export class AppService {
  constructor(@Inject(AZURE_AI_CLIENT) private readonly azureAiClient: AIProjectsClient) {}
  
  async getHello() {
    const connections = await this.azureAiClient.connections.listConnections();

    return connections.map(connection => ({
      id: connection.id,
      name: connection.name,
    }));
  }
}
