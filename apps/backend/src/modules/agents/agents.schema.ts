import { z } from 'zod';

export const TaskQuestionsSchema = z.object({
  context: z.string().min(1),
  questions: z.array(
    z.object({
      id: z.string().regex(/^q\d+$/),
      text: z.string().min(1),
    }),
  ),
});

export type TaskQuestions = z.infer<typeof TaskQuestionsSchema>;
