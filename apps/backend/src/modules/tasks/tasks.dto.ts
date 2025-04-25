import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTaskBody = z.object({
  message: z.string().min(1),
  language: z.string().min(2).max(10),
});

export class CreateTaskDto extends createZodDto(CreateTaskBody) {}
