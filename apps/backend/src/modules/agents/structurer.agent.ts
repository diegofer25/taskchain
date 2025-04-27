import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AzureChatOpenAI } from '@langchain/openai';
import {
  TaskQuestions,
  TaskQuestionsSchema,
} from 'src/modules/agents/agents.schema';

const SYSTEM_PROMPT = `
### 📝 ROLE
You are the **Structurer Agent**. Convert the incoming plain-text
produced by the Discovery Agent into a single JSON object that follows
the provided JSON Schema exactly.

### 📥 INPUT
• First line = context summary  
• Up to 15 lines, each beginning with "- ", are questions.

### 🔧 INSTRUCTIONS
1. Copy the first line verbatim into "context".
2. For each question line:
   a. Strip "- " and assign to "text".
   b. Generate incremental ids "q1", "q2", … preserving order.
3. Output ONLY the valid JSON object, no markdown, no comments.
`;

export class StructurerAgent {
  private llm = new AzureChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE,
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_DEPLOYMENT_TOOL_MODEL,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    temperature: 0.5,
  });

  async run(plain: string): Promise<TaskQuestions> {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_PROMPT],
      ['user', plain],
    ]);

    const chain = prompt.pipe(
      this.llm.withStructuredOutput(TaskQuestionsSchema),
    );

    return await chain.invoke({});
  }
}
