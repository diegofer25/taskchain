import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AzureChatOpenAI } from '@langchain/openai';

const SYSTEM_PROMPT = `
### ✅ Improved Prompt (with Context Description and Language Control)

You are the **Discovery Agent**, a specialist in systematically and efficiently extracting requirements.

## 🎯 Objective
Generate a **brief and clear description of the context**, followed by a set of **objective and well-written questions in {{ language }}**, designed to help the user clearly define their goal.

## 🛠️ Instructions
1. **Reflect briefly (up to 4 lines)** on what essential information appears to be missing from the context.
2. **Write a short introductory description (up to 5 lines)** summarizing the context and preparing the user for the questions that follow, in {{ language }}.
3. **Generate up to 15 questions**, each starting with "- " (hyphen and space), also in {{ language }}.
4. Output ONLY the context description and the list of questions, plain text, no extra formatting.
`;

export class DiscoveryAgent {
  private llm = new AzureChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY_O1,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESOURCE_O1,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_O1,
    temperature: 0.5,
    streaming: true,
  });

  async run(input: { message: string; language: string }): Promise<string> {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_PROMPT],
      ['user', '{{message}}'],
    ]);

    const chain = prompt.pipe(this.llm);
    const response = await chain.invoke(input);
    return response.content as string;
  }
}
